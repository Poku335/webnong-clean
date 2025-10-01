// 🧪 Test Order Status Change Component
import React, { useState } from 'react';
import { changeOrderStatus } from '../api/admin';
// import { toast } from 'react-toastify'; // Replaced with window.alert

const TestOrderStatus = () => {
  const [orderId, setOrderId] = useState(1);
  const [orderStatus, setOrderStatus] = useState('รอดำเนินการ');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      console.log('Testing order status change...');
      console.log('Order ID:', orderId);
      console.log('Order Status:', orderStatus);
      
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await changeOrderStatus(token, orderId, orderStatus);
      console.log('Response:', response);
      
      // alert('Test successful!'); // ไม่แสดง alert สำหรับการกระทำปกติ
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">🧪 Test Order Status Change</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order ID:</label>
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Order Status:</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="รอดำเนินการ">รอดำเนินการ</option>
            <option value="ชำระเงินแล้ว">ชำระเงินแล้ว</option>
          </select>
        </div>
        
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Order Status Change'}
        </button>
      </div>
    </div>
  );
};

export default TestOrderStatus;