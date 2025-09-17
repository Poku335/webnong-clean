import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const token = useEcomStore((s) => s.token);
  const clearCart = useEcomStore((s) => s.clearCart);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const hasCalled = useRef(false); // ✅ ใช้ ref เพื่อกันการยิงซ้ำ

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const finalizeOrder = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5001/api/user/finalize-order",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.ok) {
          // ✅ เคลียร์ตะกร้าฝั่ง client ให้สอดคล้องกับ server
          clearCart();
          setStatus("success");
          setTimeout(() => navigate("/user/history"), 3000);
        } else {
          console.error("Finalize failed:", res.data.message);
          setStatus("error");
        }
      } catch (err) {
        console.error("Finalize error:", err.response?.data || err.message);
        setStatus("error");
      }
    };

    finalizeOrder();
  }, [token, navigate, clearCart]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="payment-message loading">
          <div className="spinner" />
          <p>กำลังดำเนินการชำระเงิน กรุณารอสักครู่...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="payment-message success">
          <h2>✅ ชำระเงินสำเร็จแล้ว</h2>
          <p>ระบบกำลังพาคุณไปยังหน้าประวัติการสั่งซื้อ...</p>
        </div>
      );
    }

    return (
      <div className="payment-message error">
        <h2>❌ เกิดข้อผิดพลาดในการชำระเงิน</h2>
        <p>กรุณาลองใหม่อีกครั้ง หรือใช้ช่องทางอื่น</p>
      </div>
    );
  };

  return <div className="payment-container">{renderContent()}</div>;
};

export default Payment;
