import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../stripe.css";
import { saveOrder } from "../api/user";
import useEcomStore from "../store/ecom-store";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { useNavigate } from "react-router-dom";
import PaymentSlipUpload from "./PaymentSlipUpload";

export default function CheckoutForm({ onPaymentMethodChange, onPaymentSlipChange }) {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart);

  const navigate = useNavigate();

  // Stripe temporarily disabled

  // const [message, setMessage] = useState(null); // Temporarily disabled
  const [paymentMethod, setPaymentMethod] = useState("QR Code");
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);

  useEffect(() => {
    // Load QR Code from admin or use default
    const adminQRCode = localStorage.getItem('admin_qr_code');
    if (adminQRCode) {
      setQrCodeImage(adminQRCode);
    } else {
      // Use default QR Code from your link
      setQrCodeImage('https://i.imgur.com/Z70Aj3Z.png');
    }
  }, []);

  // Notify parent components when values change
  useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange(paymentMethod);
    }
  }, [paymentMethod, onPaymentMethodChange]);

  useEffect(() => {
    if (onPaymentSlipChange) {
      onPaymentSlipChange(paymentSlip);
    }
  }, [paymentSlip, onPaymentSlipChange]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "ปลายทาง") {
      alert("ระบบชำระเงินด้วยบัตรเครดิตชั่วคราวไม่พร้อมใช้งาน กรุณาเลือก 'QR Code' แทน");
      return;

    } else if (paymentMethod === "QR Code") {
      if (!paymentSlip) {
        alert("กรุณาอัปโหลดสลิปโอนเงิน");
        return;
      }
      
      // Create Order with QR Code
      const qrPayload = {
        paymentMethod: "QR Code",
        qrCodeImage: qrCodeImage,
        paymentSlip: paymentSlip,
        paymentStatus: "pending"
      };

      saveOrder(token, qrPayload)
        .then((res) => {
          console.log("Order API response", res.data);
          clearCart();
                 // alert("สั่งซื้อสำเร็จ! กรุณารอการตรวจสอบจากแอดมิน"); // ไม่แสดง alert สำหรับการกระทำปกติ
          navigate("/user/history");
        })
        .catch((err) => {
          console.error("Error saving order", err.response?.data || err.message);
          alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
        });
    }
  };

  // const paymentElementOptions = {
  //   layout: "tabs",
  // }; // Temporarily disabled

  return (
    <>
      <form className="space-y-6" id="payment-form" onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">เลือกวิธีการชำระเงิน</h3>
          </div>
          
          <div className="space-y-3">
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors duration-200 ${
              paymentMethod === "ปลายทาง" 
                ? "border-orange-500 bg-orange-100 shadow-md" 
                : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="ปลายทาง"
                checked={paymentMethod === "ปลายทาง"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  localStorage.setItem('selectedPaymentMethod', e.target.value);
                }}
                className="mr-4 w-4 h-4 text-orange-600"
              />
              <div className="flex-1">
                <span className="font-semibold text-gray-900">ชำระเงินปลายทาง</span>
                <p className="text-sm text-gray-600">ชำระเงินเมื่อได้รับสินค้า</p>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors duration-200 ${
              paymentMethod === "QR Code" 
                ? "border-orange-500 bg-orange-100 shadow-md" 
                : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="QR Code"
                checked={paymentMethod === "QR Code"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  localStorage.setItem('selectedPaymentMethod', e.target.value);
                }}
                className="mr-4 w-4 h-4 text-orange-600"
              />
              <div className="flex-1">
                <span className="font-semibold text-gray-900">ชำระเงินด้วย QR Code</span>
                <p className="text-sm text-gray-600">สแกน QR Code และอัปโหลดสลิป</p>
              </div>
            </label>
          </div>
        </div>

        {/* Stripe Payment Element - Temporarily disabled */}
        {/* Warning message removed */}

        {/* QR Code Payment - Only show for "QR Code" */}
        {paymentMethod === "QR Code" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h4 className="text-lg font-bold text-gray-800">ชำระเงินด้วย QR Code</h4>
            </div>

            {/* Show QR Code from Admin */}
            {qrCodeImage && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h5 className="font-medium text-gray-800 mb-3">QR Code สำหรับการชำระเงิน</h5>
                <div className="flex justify-center mb-3">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <img
                      src={qrCodeImage}
                      alt="QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Upload Payment Slip */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h5 className="font-medium text-gray-800 mb-3">อัปโหลดสลิปโอนเงิน</h5>
              <p className="text-sm text-gray-600 mb-3">กรุณาอัปโหลดรูปภาพสลิปโอนเงินเพื่อยืนยันการชำระเงิน</p>
              
              <PaymentSlipUpload
                setPaymentSlip={setPaymentSlip}
                paymentSlip={paymentSlip}
              />
            </div>
          </div>
        )}

        {/* Show any error or success messages */}
        {/* {message && <div id="payment-message">{message}</div>} */}
      </form>
    </>
  );
}

CheckoutForm.propTypes = {
  onPaymentMethodChange: PropTypes.func,
  onPaymentSlipChange: PropTypes.func,
};
