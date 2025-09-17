// rafce
import { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    handleGetOrder(token);
  }, [token]);

  const handleGetOrder = (token) => {
    getOrdersAdmin(token)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then(() => {
        toast.success("Update Status Success!!!");
        handleGetOrder(token);
      })
      .catch((err) => console.log(err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-gray-200 text-gray-800";
      case "Processing":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-blue-200 text-blue-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const filtered = orders.filter((o) => {
    const okStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    const created = new Date(o.createdAt).getTime();
    const fromOk = !dateFrom || created >= new Date(dateFrom + "T00:00:00").getTime();
    const toOk = !dateTo || created <= new Date(dateTo + "T23:59:59").getTime();
    return okStatus && fromOk && toOk;
  });

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">จัดการคำสั่งซื้อ</h2>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">สถานะ</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="ALL">ทั้งหมด</option>
            <option value="Not Process">Not Process</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">จากวันที่</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">ถึงวันที่</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead className="bg-gray-100 font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ลำดับ</th>
              <th className="px-4 py-2 border">ผู้ใช้งาน</th>
              <th className="px-4 py-2 border">วันที่</th>
              <th className="px-4 py-2 border">สินค้า</th>
              <th className="px-4 py-2 border">รวม</th>
              <th className="px-4 py-2 border">สถานะ</th>
              <th className="px-4 py-2 border">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">
                  <p className="font-medium">{item.orderedBy.email}</p>
                  <p className="text-sm text-gray-500">{item.orderedBy.address}</p>
                </td>
                <td className="px-4 py-2 border text-center">{dateFormat(item.createdAt)}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-5">
                    {item.productsOnOrders?.map((product, idx) => (
                      <li key={idx} className="text-sm">
                        {product.product.title} -{" "}
                        <span className="text-gray-600">
                          {product.count} x {numberFormat(product.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border text-right font-medium">{numberFormat(item.cartTotal)}</td>
                <td className="px-4 py-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${getStatusColor(item.orderStatus)}`}
                  >
                    {item.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <select
                    value={item.orderStatus}
                    onChange={(e) => handleChangeOrderStatus(token, item.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Not Process">Not Process</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOrders;
