import React, { useState } from "react";
import { Trash2, Minus, Plus, ListCheck } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { Link, useNavigate } from "react-router-dom";
import { createUserCart } from "../../api/user";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";

const ListCart = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((s) => s.user);
  const token = useEcomStore((s) => s.token);

  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);
  const actionRemoveProduct = useEcomStore((state) => state.actionRemoveProduct);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  const navigate = useNavigate();

  const handleSaveCart = async () => {
    await createUserCart(token, { cart: carts })
      .then((res) => {
        toast.success("บันทึกตะกร้าเรียบร้อยแล้ว", {
          position: "top-center",
        });
        navigate("/checkout");
      })
      .catch((err) => {
        console.log("err", err);
        toast.warning(err.response?.data?.message || "เกิดข้อผิดพลาด");
      });
  };

  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      {/* Header */}
      <div className="flex gap-4 mb-4 items-center">
        <ListCheck size={26} className="text-gray-500" />
        <p className="text-2xl font-bold text-gray-800">
          ตะกร้าสินค้า {carts.length} รายการ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left */}
        <div className="col-span-2">
          {carts.length < 1 && (
            <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          )}
          {carts.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-3 rounded-md shadow-md mb-2 border border-gray-200"
            >
              {/* Row 1 */}
              <div className="flex justify-between mb-2">
                {/* Left */}
                <div className="flex gap-2 items-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      className="w-16 h-16 rounded-md object-cover"
                      src={item.images[0].url}
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => actionRemoveProduct(item.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 />
                </button>
              </div>

              {/* Row 2  */}
              <div className="flex justify-between items-center">
                {/* Quantity */}
                <div className="border rounded-md px-2 py-1 flex items-center gap-2">
                  <button
                    onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    disabled={item.count <= 1}
                  >
                    <Minus size={16} />
                  </button>

                  <span className="px-3">{item.count}</span>

                  <button
                    onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {/* Price */}
                <div className="font-bold text-gray-800">
                  {numberFormat(item.price * item.count)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right */}
        <div className="bg-gray-50 p-4 rounded-md shadow-md space-y-4 border border-gray-200 h-fit">
          <p className="text-2xl font-bold text-gray-800">ยอดรวม</p>

          <div className="flex justify-between">
            <span className="text-gray-600">รวมสุทธิ</span>
            <span className="text-2xl font-bold text-gray-800">
              {numberFormat(getTotalPrice())}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {user ? (
              <button
                disabled={carts.length < 1}
                onClick={handleSaveCart}
                className={`w-full rounded-md text-white py-2 shadow-md transition-colors 
                  ${
                    carts.length < 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                สั่งซื้อ
              </button>
            ) : (
              <Link to={"/login"}>
                <button className="bg-blue-500 w-full rounded-md text-white py-2 shadow-md hover:bg-blue-600">
                  Login
                </button>
              </Link>
            )}

            <Link to={"/shop"}>
              <button className="bg-gray-400 w-full rounded-md text-white py-2 shadow-md hover:bg-gray-500">
                เลือกซื้อสินค้าต่อ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;
