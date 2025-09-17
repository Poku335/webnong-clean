// rafce
import { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      setForm(initialState);
      getProduct();
      toast.success(`เพิ่มข้อมูล "${res.data.title}" สำเร็จ`);
    } catch (err) {
      console.log(err);
      toast.error("เพิ่มสินค้าล้มเหลว");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("จะลบจริงๆ หรอ?")) {
      try {
        const res = await deleteProduct(token, id);
        toast.success("Deleted สินค้าเรียบร้อยแล้ว");
        getProduct();
      } catch (err) {
        console.log(err);
        toast.error("ลบสินค้าล้มเหลว");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">เพิ่มข้อมูลสินค้า</h1>

        {/* Multi-column input */}
        <div className="flex flex-wrap gap-4">
          <input
            className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.title}
            onChange={handleOnChange}
            placeholder="ชื่อสินค้า"
            name="title"
            required
          />
          <input
            className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.description}
            onChange={handleOnChange}
            placeholder="รายละเอียด"
            name="description"
            required
          />
          <input
            type="number"
            className="flex-1 min-w-[120px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.price}
            onChange={handleOnChange}
            placeholder="ราคา"
            name="price"
            required
          />
          <input
            type="number"
            className="flex-1 min-w-[120px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.quantity}
            onChange={handleOnChange}
            placeholder="จำนวน"
            name="quantity"
            required
          />
          <select
            className="flex-1 min-w-[180px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="categoryId"
            onChange={handleOnChange}
            required
            value={form.categoryId}
          >
            <option value="" disabled>
              เลือกประเภทสินค้า
            </option>
            {categories.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload file */}
        <Uploadfile form={form} setForm={setForm} />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 hover:scale-105 transition-transform duration-200"
        >
          เพิ่มสินค้า
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              <th className="px-3 py-2 border">No.</th>
              <th className="px-3 py-2 border">รูปภาพ</th>
              <th className="px-3 py-2 border">ชื่อสินค้า</th>
              <th className="px-3 py-2 border">รายละเอียด</th>
              <th className="px-3 py-2 border">ราคา</th>
              <th className="px-3 py-2 border">จำนวน</th>
              <th className="px-3 py-2 border">จำนวนที่ขายได้</th>
              <th className="px-3 py-2 border">วันที่อัปเดต</th>
              <th className="px-3 py-2 border">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 py-2 border text-center">{index + 1}</td>
                <td className="px-3 py-2 border text-center">
                  {item.images.length > 0 ? (
                    <img
                      className="w-24 h-24 rounded-lg shadow-md object-cover"
                      src={item.images[0].url}
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 border">{item.title}</td>
                <td className="px-3 py-2 border">{item.description}</td>
                <td className="px-3 py-2 border">{numberFormat(item.price)}</td>
                <td className="px-3 py-2 border">{item.quantity}</td>
                <td className="px-3 py-2 border">{item.sold}</td>
                <td className="px-3 py-2 border">{dateFormat(item.updatedAt)}</td>
                <td className="px-3 py-2 border flex gap-2 justify-center">
                  <Link
                    to={"/admin/product/" + item.id}
                    className="bg-yellow-500 text-white p-2 rounded-md shadow-md hover:bg-yellow-600 hover:scale-105 transition-transform duration-200"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-md shadow-md hover:bg-red-600 hover:scale-105 transition-transform duration-200"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormProduct;
