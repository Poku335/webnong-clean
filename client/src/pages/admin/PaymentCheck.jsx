import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  RefreshCw, 
  User, 
  DollarSign, 
  Calendar,
  QrCode,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Loader
} from "lucide-react";
import { getPaymentOrders, updatePaymentStatus } from "../../api/admin";
import { numberFormat } from "../../utils/number";
import useEcomStore from "../../store/ecom-store";

export default function PaymentCheck() {
  const token = useEcomStore(s => s.token);
  const user = useEcomStore(s => s.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("ALL");

  useEffect(() => {
    if (token && user) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("กรุณาเข้าสู่ระบบ");
    }
  }, [token, user]);

  const fetchOrders = async () => {
    if (!token) {
      setError("กรุณาเข้าสู่ระบบ");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await getPaymentOrders(token);
      setOrders(response.data);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        setError("กรุณาเข้าสู่ระบบใหม่");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!token) {
      setError("กรุณาเข้าสู่ระบบ");
      return;
    }
    
    try {
      await updatePaymentStatus(token, orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus: newStatus }
          : order
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      if (err.response?.status === 401) {
        setError("กรุณาเข้าสู่ระบบใหม่");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchTerm || 
      order.orderedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || 
      (statusFilter === "PENDING" && order.paymentStatus === "pending") ||
      (statusFilter === "COMPLETE" && order.paymentStatus === "complete");
    
    const matchesPaymentMethod = paymentMethodFilter === "ALL" || 
      order.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-gray-600 font-medium">กำลังโหลดข้อมูลการชำระเงิน...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          {error === "กรุณาเข้าสู่ระบบ" || error === "กรุณาเข้าสู่ระบบใหม่" ? (
            <a 
              href="/login" 
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors duration-200"
            >
              เข้าสู่ระบบ
            </a>
          ) : (
            <button 
              onClick={fetchOrders}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              ลองใหม่
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-orange-500" />
                ตรวจสอบการเงิน
              </h1>
              <p className="text-gray-600">ตรวจสอบและจัดการสถานะการชำระเงิน</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 px-4 py-2 rounded-xl">
                <span className="text-orange-700 font-semibold text-sm">ทั้งหมด: {orders.length}</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-xl">
                <span className="text-green-700 font-semibold text-sm">ชำระแล้ว: {orders.filter(o => o.paymentStatus === 'complete').length}</span>
              </div>
              <div className="bg-yellow-100 px-4 py-2 rounded-xl">
                <span className="text-yellow-700 font-semibold text-sm">รอชำระ: {orders.filter(o => o.paymentStatus === 'pending').length}</span>
              </div>
              <button 
                onClick={fetchOrders}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                ค้นหา
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อ, อีเมล หรือรหัสออเดอร์"
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
                <option value="PENDING">รอชำระ</option>
                <option value="COMPLETE">ชำระแล้ว</option>
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
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1200px]">
              <thead className="bg-orange-100">
                <tr>
                  <th className="w-20 px-3 py-4 text-center text-xs font-bold text-gray-900">#</th>
                  <th className="w-48 px-3 py-4 text-left text-xs font-bold text-gray-900">
                    <User className="w-4 h-4 inline mr-1" />
                    ลูกค้า
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    วิธีการชำระ
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    จำนวนเงิน
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">สถานะ</th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <QrCode className="w-4 h-4 inline mr-1" />
                    QR Code
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    วันที่
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-orange-100/50 transition-all duration-300"
                    >
                      <td className="px-3 py-4 text-xs font-semibold text-gray-900 text-center">
                        #{order.id}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {order.orderedBy?.name || order.orderedBy?.fullName || 'ไม่มีชื่อ'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{order.orderedBy?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          order.paymentMethod === "QR Code" 
                            ? "bg-blue-100 text-blue-800 border border-blue-200" 
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}>
                          {order.paymentMethod === "QR Code" ? (
                            <>
                              <QrCode className="w-3 h-3 mr-1" />
                              QR Code
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3 mr-1" />
                              ปลายทาง
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className="font-semibold text-orange-600 text-sm">
                          {numberFormat(order.cartTotal)}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "complete" 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}>
                          {order.paymentStatus === "complete" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              ชำระแล้ว
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              รอชำระ
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {order.qrCodeImage ? (
                          <div className="flex flex-col items-center space-y-1">
                            <img 
                              src={order.qrCodeImage} 
                              alt="QR Code" 
                              className="w-8 h-8 object-contain border rounded"
                            />
                            <button 
                              onClick={() => window.open(order.qrCodeImage, '_blank')}
                              className="btn-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              ดู
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {order.paymentStatus === "pending" ? (
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="input-field text-xs py-1 px-2 w-full"
                          >
                            <option value="pending">รอชำระ</option>
                            <option value="complete">ชำระแล้ว</option>
                          </select>
                        ) : (
                          <span className="text-green-600 font-medium text-xs flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            ชำระแล้ว
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลการชำระเงิน</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
