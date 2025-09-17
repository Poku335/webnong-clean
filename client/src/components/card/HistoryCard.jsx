// rafce

import { useState, useEffect } from "react";
import { getOrders } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { Link } from "react-router-dom";
import { dateFormat } from "../../utils/dateformat";
import { numberFormat } from "../../utils/number";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  // console.log(token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // code
    hdlGetOrders(token);
  }, [token]);

  const hdlGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        // console.log(res);
        setOrders(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-gray-200";
      case "Processing":
        return "bg-blue-200";
      case "Completed":
        return "bg-green-200";
      case "Cancelled":
        return "bg-red-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title">ประวัติการสั่งซื้อ</h1>
        <p className="text-gray-600">ดูประวัติการสั่งซื้อของคุณ</p>
      </div>
      
      <div className="space-y-6">
        {orders?.map((item, index) => (
          <div key={index} className="card p-6">
            {/* Order Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">วันที่สั่งซื้อ</p>
                <p className="text-lg font-semibold text-gray-900">{dateFormat(item.updatedAt)}</p>
              </div>
              <div>
                <span className={`${getStatusColor(item.orderStatus)} px-3 py-1 rounded-full text-sm font-medium`}>
                  {item.orderStatus}
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">รูป</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">สินค้า</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">ราคา</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">จำนวน</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">ราคารวม</th>
                  </tr>
                </thead>
                <tbody>
                  {item.productsOnOrders?.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <Link to={`/product/${row.productId}`}>
                          {row.product?.images?.[0]?.url ? (
                            <img
                              src={row.product.images[0].url}
                              alt={row.product?.title}
                              className="w-16 h-16 object-cover rounded-lg hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">ไม่มีรูป</span>
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <Link to={`/product/${row.productId}`} className="hover:text-orange-600 transition-colors">
                          <p className="font-medium text-gray-900">{row.product?.title}</p>
                          {row.product?.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{row.product.description}</p>
                          )}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-medium text-gray-900">{numberFormat(row.price)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-medium text-gray-900">{row.count}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-orange-600">{numberFormat(row.count * row.price)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">ราคารวม</p>
                  <p className="text-2xl font-bold text-orange-600">{numberFormat(item.cartTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCard;
