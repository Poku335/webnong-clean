// rafce

import SummaryCard from "../components/card/SummaryCard";

const Checkout = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title">ชำระเงิน</h1>
        <p className="text-secondary-600">กรอกข้อมูลการชำระเงินของคุณ</p>
      </div>
      <SummaryCard />
    </div>
  );
};

export default Checkout;
