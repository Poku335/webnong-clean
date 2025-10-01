// rafce
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  User,
  Calendar,
  Package,
  Image as ImageIcon,
  ZoomIn
} from "lucide-react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";
import OrderDetailsModal from "./OrderDetailsModal";

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState("");
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    handleGetOrder(token);
  }, [token]);

  const handleGetOrder = (token) => {
    setLoading(true);
    getOrdersAdmin(token)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
      });
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    console.log('Token:', token);
    console.log('Order ID:', orderId);
    console.log('Order Status:', orderStatus);
    console.log('Changing order status:', { orderId, orderStatus });
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        console.log('Status change response:', res);
        // alert("Update Status Success!!!"); // ไม่แสดง alert สำหรับการกระทำปกติ
        handleGetOrder(token);
      })
      .catch((err) => {
        console.error('Status change error:', err);
        alert("Failed to update status: " + (err.response?.data?.message || err.message));
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "รอดำเนินการ":
        return "bg-yellow-200 text-yellow-800 border border-yellow-300";
      case "ชำระเงินแล้ว":
        return "bg-green-200 text-green-800 border border-green-300";
      default:
        return "bg-gray-200 text-gray-800 border border-gray-300";
    }
  };


  const handleImageClick = (imageUrl) => {
    setImageModalUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageModalUrl("");
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const okStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
      const okPaymentMethod = paymentMethodFilter === "ALL" || o.paymentMethod === paymentMethodFilter;
      const okSearch = !searchTerm ||
        o.orderedBy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.orderedBy.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.productsOnOrders?.some(p => p.product.title.toLowerCase().includes(searchTerm.toLowerCase()));
      const created = new Date(o.createdAt).getTime();
      const fromOk = !dateFrom || created >= new Date(dateFrom + "T00:00:00").getTime();
      const toOk = !dateTo || created <= new Date(dateTo + "T23:59:59").getTime();
      return okStatus && okPaymentMethod && okSearch && fromOk && toOk;
    });
  }, [orders, statusFilter, paymentMethodFilter, searchTerm, dateFrom, dateTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการคำสั่งซื้อ</h1>
            <p className="text-gray-600">ตรวจสอบและจัดการคำสั่งซื้อทั้งหมด</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 px-4 py-2 rounded-xl">
              <span className="text-orange-600 font-semibold">ทั้งหมด: {orders.length}</span>
            </div>
            <div className="bg-yellow-100 px-4 py-2 rounded-xl">
              <span className="text-yellow-700 font-semibold">รอดำเนินการ: {orders.filter(o => o.orderStatus === "รอดำเนินการ").length}</span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-xl">
              <span className="text-green-700 font-semibold">ชำระเงินแล้ว: {orders.filter(o => o.orderStatus === "ชำระเงินแล้ว").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              ค้นหา
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ค้นหาด้วยอีเมล, ที่อยู่, หรือชื่อสินค้า"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              สถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="รอดำเนินการ">รอดำเนินการ</option>
              <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              วิธีการชำระ
            </label>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="QR Code">QR Code</option>
              <option value="ปลายทาง">ปลายทาง</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              จากวันที่
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              ถึงวันที่
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-900 w-12"></th>
                <th className="px-3 py-4 text-left text-sm font-bold text-gray-900 w-48">
                  <User className="w-4 h-4 inline mr-2" />
                  ลูกค้า
                </th>
                <th className="px-3 py-4 text-left text-sm font-bold text-gray-900 w-32">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  วันที่สั่งซื้อ
                </th>
                <th className="px-3 py-4 text-left text-sm font-bold text-gray-900 w-48">
                  <Package className="w-4 h-4 inline mr-2" />
                  สินค้า
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-900 w-24">
                  ยอดรวม
                </th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-900 w-28">สถานะ</th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-900 w-32">จัดการ</th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-900 w-24">รายละเอียด</th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-900 w-28">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  สลิป
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filtered.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-orange-50/50 transition-all duration-300"
                  >
                    <td className="px-3 py-4 text-sm font-semibold text-gray-900 text-center">
                      {index + 1}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm truncate">{item.orderedBy.email}</p>
                          <p className="text-sm text-gray-500 truncate">{item.orderedBy.address || 'ไม่มีที่อยู่'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {dateFormat(item.createdAt)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="space-y-1">
                        {item.productsOnOrders?.slice(0, 1).map((product, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium truncate">{product.product.title}</div>
                            <div className="text-gray-500">
                              {product.count} x {numberFormat(product.price)}
                            </div>
                          </div>
                        ))}
                        {item.productsOnOrders?.length > 1 && (
                          <p className="text-sm text-orange-500 font-medium">
                            +{item.productsOnOrders.length - 1} รายการ
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-bold text-orange-500 text-right">
                      {numberFormat(item.cartTotal)} บาท
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(item.orderStatus)}`}>
                        {item.orderStatus === "รอดำเนินการ" ? <Clock className="w-2.5 h-2.5 mr-1" /> : <CheckCircle className="w-2.5 h-2.5 mr-1" />}
                        <span className="hidden lg:inline">{item.orderStatus}</span>
                        <span className="lg:hidden">{item.orderStatus === "รอดำเนินการ" ? "รอดำเนินการ" : "ชำระเงินสำเร็จ"}</span>
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <select
                        value={item.orderStatus}
                        onChange={(e) => handleChangeOrderStatus(token, item.id, e.target.value)}
                        className="input-field text-sm py-2 px-2 w-full"
                      >
                        <option value="รอดำเนินการ">รอดำเนินการ</option>
                        <option value="ชำระเงินแล้ว">ชำระเงินสำเร็จ</option>
                      </select>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => handleOrderDetails(item)}
                        className="btn-ghost text-sm px-2 py-2 flex items-center gap-2 w-full justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden lg:inline">ดู</span>
                      </button>
                    </td>
                    <td className="px-3 py-4 text-center">
                      {item.paymentSlip ? (
                        <div className="flex flex-col items-center space-y-1">
                          <div className="relative group">
                            <img
                              src={item.paymentSlip}
                              alt="Payment Slip"
                              className="w-12 h-12 object-cover rounded border border-orange-100 cursor-pointer hover:border-orange-300 transition-all duration-300"
                              onClick={() => handleImageClick(item.paymentSlip)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-300 flex items-center justify-center">
                              <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleImageClick(item.paymentSlip)}
                              className="text-sm px-1 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            >
                              ดู
                            </button>
                            <button
                              onClick={() => window.open(item.paymentSlip, '_blank')}
                              className="text-sm px-1 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            >
                              เปิด
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center border border-gray-200">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-400">ไม่มี</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบคำสั่งซื้อ</h3>
            <p className="text-gray-600 mb-6">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setPaymentMethodFilter("ALL");
                setSearchTerm("");
                setDateFrom("");
                setDateTo("");
              }}
              className="btn-primary"
            >
              รีเซ็ตตัวกรอง
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageModalUrl}
                alt="Payment Slip"
                className="max-w-full max-h-full rounded-2xl shadow-2xl"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={closeOrderDetails}
      />
    </div>
  );
};

export default TableOrders;
