// rafce
import { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import SummaryCard from "../components/card/SummaryCard";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("QR Code");
  const [paymentSlip, setPaymentSlip] = useState(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title">ชำระเงิน</h1>
        <p className="section-subtitle">กรอกข้อมูลการชำระเงินของคุณ</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Order Summary */}
          <div className="order-2 lg:order-1">
            <SummaryCard 
              paymentMethod={paymentMethod}
              paymentSlip={paymentSlip}
            />
          </div>
          
          {/* Right - Payment Form */}
          <div className="order-1 lg:order-2">
            <CheckoutForm 
              onPaymentMethodChange={setPaymentMethod}
              onPaymentSlipChange={setPaymentSlip}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
