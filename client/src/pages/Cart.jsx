// rafce

import React from "react";
import ListCart from "../components/card/ListCart";

const Cart = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title">ตะกร้าสินค้า</h1>
        <p className="text-secondary-600">ตรวจสอบสินค้าในตะกร้าของคุณ</p>
      </div>
      <ListCart />
    </div>
  );
};

export default Cart;
