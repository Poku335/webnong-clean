import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const hasCalled = useRef(false); // ✅ ใช้ ref เพื่อกันการยิงซ้ำ

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    // เนื่องจาก order ถูกสร้างแล้วในหน้า checkout
    // หน้า Payment นี้ควรแสดงผลสำเร็จทันที
    setStatus("success");
    setTimeout(() => navigate("/user/history"), 3000);
  }, [navigate]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="payment-message loading">
          <div className="spinner" />
          <p>กำลังประมวลผลการสั่งซื้อ กรุณารอสักครู่...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="payment-message success">
          <h2>✅ สั่งซื้อสำเร็จแล้ว</h2>
          <p>ขอบคุณสำหรับการสั่งซื้อ! ระบบกำลังพาคุณไปยังหน้าประวัติการสั่งซื้อ...</p>
        </div>
      );
    }

    return (
      <div className="payment-message error">
        <h2>❌ เกิดข้อผิดพลาดในการประมวลผล</h2>
        <p>กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่</p>
      </div>
    );
  };

  return <div className="payment-container">{renderContent()}</div>;
};

export default Payment;
