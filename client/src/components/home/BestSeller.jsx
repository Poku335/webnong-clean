import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../card/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
import productsMock from "../../mock/products.json";

const BestSeller = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // code
    loadData();
  }, []);

  const loadData = () => {
    listProductBy("sold", "desc", 12)
      .then((res) => {
        console.log("BestSeller API response:", res.data);
        setData(res.data || []);
      })
      .catch((err) => {
        console.log("BestSeller API error:", err);
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

export default BestSeller;
