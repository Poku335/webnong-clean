import { Trash2, Minus, Plus, ListCheck, ShoppingCart } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { Link, useNavigate } from "react-router-dom";
import { createUserCart } from "../../api/user";
// import { toast } from "react-toastify"; // Replaced with window.alert
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
      .then(() => {
        // alert("บันทึกตะกร้าเรียบร้อยแล้ว"); // ไม่แสดง alert สำหรับการกระทำปกติ
        navigate("/checkout");
      })
      .catch((err) => {
        console.log("err", err);
        alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ListCheck className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-900">รายการสินค้า ({carts.length} รายการ)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2">
          {carts.length < 1 && (
            <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          )}
          {carts.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-xl shadow-md mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Row 1 */}
              <div className="flex justify-between mb-2">
                {/* Left */}
                <div className="flex gap-3 items-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      className="w-20 h-20 rounded-lg object-cover"
                      src={item.images[0].url}
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => actionRemoveProduct(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Row 2  */}
              <div className="flex justify-between items-center">
                {/* Quantity */}
                <div className="border-2 border-gray-200 rounded-lg px-3 py-2 flex items-center gap-3">
                  <button
                    onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                    className="p-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    disabled={item.count <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-3 font-semibold text-gray-900">{item.count}</span>

                  <button
                    onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                    className="p-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {/* Price */}
                <div className="text-xl font-bold text-orange-600">
                  {numberFormat(item.price * item.count)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200/50 space-y-6 h-fit">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">สรุปคำสั่งซื้อ</h3>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">รวมสุทธิ</span>
            <span className="text-2xl font-bold text-orange-600">
              {numberFormat(getTotalPrice())}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {user ? (
              <button
                disabled={carts.length < 1}
                onClick={handleSaveCart}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  carts.length < 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                สั่งซื้อ
              </button>
            ) : (
              <Link to={"/login"}>
                <button className="btn-primary w-full">
                  เข้าสู่ระบบ
                </button>
              </Link>
            )}

            <Link to={"/shop"}>
              <button className="btn-secondary w-full">
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
