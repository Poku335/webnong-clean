import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../card/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
import productsMock from "../../mock/products.json";

const NewProduct = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // code
    loadData();
  }, []);

  const loadData = () => {
    listProductBy("updatedAt", "desc", 12)
      .then((res) => {
        console.log("NewProduct API response:", res.data);
        setData(res.data || []);
      })
      .catch((err) => {
        console.log("NewProduct API error:", err);
        // Fallback to mock data
        setData(productsMock.slice(0, 12));
      });
  };

  console.log(data);

  return (
    <SwiperShowProduct>
      {data?.map((item, index) => (
        <SwiperSlide>
          <ProductCard item={item} key={index} />
        </SwiperSlide>
      ))}
    </SwiperShowProduct>
  );
};

export default NewProduct;
