import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilters } from "../api/product";
import categoriesMock from "../mock/categories.json";
import productsMock from "../mock/products.json";
import _ from "lodash";

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  // ใช้ mock data หรือไม่ (อ่านจาก localStorage หากมี)
  useMock:
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("USE_MOCK") === "true") || false,
  logout: () => {
    set({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
    });
  },
  setUseMock: (value) => {
    set({ useMock: value });
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("USE_MOCK", value ? "true" : "false");
    }
  },
  toggleUseMock: () => {
    const next = !get().useMock;
    set({ useMock: next });
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("USE_MOCK", next ? "true" : "false");
    }
  },
  actionAddtoCart: (product) => {
    const carts = get().carts;
    const updateCart = [...carts, { ...product, count: 1 }];
    // Step Uniqe
    const uniqe = _.unionWith(updateCart, _.isEqual);
    set({ carts: uniqe });
  },
  actionUpdateQuantity: (productId, newQuantity) => {
    // console.log('Update Clickkkkk', productId, newQuantity)
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      ),
    }));
  },
  actionRemoveProduct: (productId) => {
    // console.log('remove jaaaaa', productId)
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
  },
  getTotalPrice: () => {
    return get().carts.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
  },
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5002/api/login", form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
  setUser: (user) => {
    set({ user });
  },
  getCategory: async () => {
    try {
      if (get().useMock) {
        set({ categories: categoriesMock });
        return;
      }
      const res = await listCategory();
      set({ categories: res.data });
    } catch (err) {
      console.log(err);
      // fallback mock
      set({ categories: categoriesMock });
    }
  },
  getProduct: async (count) => {
    try {
      if (get().useMock) {
        const take = count ? Number(count) : productsMock.length;
        set({ products: productsMock.slice(0, take) });
        return;
      }
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (err) {
      console.log(err);
      // fallback mock
      const take = count ? Number(count) : productsMock.length;
      set({ products: productsMock.slice(0, take) });
    }
  },
  actionSearchFilters: async (arg) => {
    try {
      if (get().useMock) {
        // ฟิลเตอร์จาก productsMock ฝั่ง client
        let data = [...productsMock];
        if (arg?.query) {
          const q = String(arg.query).toLowerCase();
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              (p.description || "").toLowerCase().includes(q)
          );
        }
        if (arg?.category && Array.isArray(arg.category) && arg.category.length) {
          const ids = arg.category.map((id) => Number(id));
          data = data.filter((p) => ids.includes(Number(p.categoryId)));
        }
        if (arg?.price && Array.isArray(arg.price) && arg.price.length === 2) {
          const [min, max] = arg.price;
          data = data.filter((p) => p.price >= min && p.price <= max);
        }
        set({ products: data });
        return;
      }

      const res = await searchFilters(arg);
      set({ products: res.data });
    } catch (err) {
      console.log(err);
      // fallback mock basic
      let data = [...productsMock];
      if (arg?.query) {
        const q = String(arg.query).toLowerCase();
        data = data.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q)
        );
      }
      set({ products: data });
    }
  },
  clearCart: () => set({ carts: [] }),
});

const usePersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, usePersist));

export default useEcomStore;
