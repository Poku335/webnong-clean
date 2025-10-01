// rafce

import React from "react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListCart from "../components/card/ListCart";
import useEcomStore from "../store/ecom-store";

const Cart = () => {
  const navigate = useNavigate();
  const carts = useEcomStore((s) => s.carts);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-orange-500" />
                ตะกร้าสินค้า
              </h1>
              <p className="text-gray-600">ตรวจสอบสินค้าในตะกร้าของคุณ</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับ
              </button>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        {carts.length > 0 ? (
          <ListCart />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8">
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">ตะกร้าว่างเปล่า</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                ยังไม่มีสินค้าในตะกร้าของคุณ เริ่มช้อปปิ้งเพื่อเพิ่มสินค้าลงตะกร้า
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="btn-primary"
              >
                เริ่มช้อปปิ้ง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
