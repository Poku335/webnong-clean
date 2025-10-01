// rafce
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Calendar, 
  Package, 
  CreditCard, 
  QrCode,
  MapPin,
  Phone,
  Mail,
  Image as ImageIcon,
  ZoomIn,
  ExternalLink,
  Download
} from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState("");

  if (!order) return null;

  const handleImageClick = (imageUrl) => {
    setImageModalUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageModalUrl("");
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "QR Code":
        return <QrCode className="w-5 h-5" />;
      case "ปลายทาง":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "QR Code":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ปลายทาง":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-orange-400 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">รายละเอียดคำสั่งซื้อ</h2>
                  <p className="text-orange-50">Order ID: #{order.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-blue-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  ข้อมูลลูกค้า
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{order.orderedBy.email}</p>
                      <p className="text-sm text-gray-600">อีเมล</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{order.orderedBy.address || "ไม่ระบุ"}</p>
                      <p className="text-sm text-gray-600">ที่อยู่</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-green-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  ข้อมูลคำสั่งซื้อ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{dateFormat(order.createdAt)}</p>
                      <p className="text-sm text-gray-600">วันที่สั่งซื้อ</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5 text-green-600 font-bold text-lg">฿</span>
                    <div>
                      <p className="font-semibold text-gray-900">{numberFormat(order.cartTotal)} บาท</p>
                      <p className="text-sm text-gray-600">ยอดรวม</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-purple-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  ข้อมูลการชำระเงิน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border ${getPaymentMethodColor(order.paymentMethod)}`}>
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span className="ml-2">{order.paymentMethod}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">สถานะการชำระเงิน</p>
                    <p className="font-semibold text-gray-900">{order.paymentStatus === "pending" ? "รอดำเนินการ" : "ชำระเงินแล้ว"}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  สินค้าที่สั่งซื้อ
                </h3>
                <div className="space-y-3">
                  {order.productsOnOrders?.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product.title}</h4>
                          <p className="text-sm text-gray-600">จำนวน: {item.count} ชิ้น</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-500">{numberFormat(item.price)}</p>
                          <p className="text-sm text-gray-600">ต่อชิ้น</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Slip */}
              {order.paymentSlip && (
                <div className="bg-yellow-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    สลิปโอนเงิน
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <img
                        src={order.paymentSlip}
                        alt="Payment Slip"
                        className="w-64 h-64 object-cover rounded-xl border-2 border-yellow-200 cursor-pointer hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => handleImageClick(order.paymentSlip)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleImageClick(order.paymentSlip)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <ZoomIn className="w-4 h-4" />
                        ดูรูปภาพ
                      </button>
                      <button
                        onClick={() => window.open(order.paymentSlip, '_blank')}
                        className="btn-outline flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        เปิดในแท็บใหม่
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Image */}
              {order.qrCodeImage && (
                <div className="bg-blue-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    QR Code สำหรับชำระเงิน
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <img
                        src={order.qrCodeImage}
                        alt="QR Code"
                        className="w-48 h-48 object-cover rounded-xl border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => handleImageClick(order.qrCodeImage)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleImageClick(order.qrCodeImage)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <ZoomIn className="w-4 h-4" />
                        ดู QR Code
                      </button>
                      <button
                        onClick={() => window.open(order.qrCodeImage, '_blank')}
                        className="btn-outline flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        เปิดในแท็บใหม่
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageModalUrl}
                alt="Payment Image"
                className="max-w-full max-h-full rounded-2xl shadow-2xl"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;

