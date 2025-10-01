import React, { useState } from 'react';
// import { toast } from 'react-toastify'; // Replaced with window.alert
import { uploadPaymentSlipFormData } from '../api/userUploadFormData';
import useEcomStore from '../store/ecom-store';
import { Loader, X } from 'lucide-react';

const PaymentSlipUpload = ({ paymentSlip, setPaymentSlip }) => {
    const token = useEcomStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setIsLoading(true);
            const file = files[0];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('กรุณาเลือกไฟล์รูปภาพ');
                setIsLoading(false);
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
                setIsLoading(false);
                return;
            }

            // Upload using FormData (NEW METHOD)
            uploadPaymentSlipFormData(token, file)
                .then((res) => {
                    console.log('Payment slip upload response:', res);
                    // Use the full URL path from server
                    const fullUrl = `http://localhost:5002${res.data.filePath}`;
                    setPaymentSlip(fullUrl);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log('Upload error:', err);
                    setIsLoading(false);
        
                });
        }
    };

    const handleDelete = () => {
        setPaymentSlip(null);
        // alert('ลบสลิปโอนเงินแล้ว'); // ไม่แสดง alert สำหรับการกระทำปกติ
    };

    return (
        <div className="space-y-4">
            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-3">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm text-blue-600 font-medium">กำลังอัปโหลด...</p>
                    </div>
                </div>
            )}

            {/* Success State */}
            {paymentSlip && !isLoading && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-semibold text-green-700">อัปโหลดสลิปโอนเงินสำเร็จแล้ว</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative">
                            <img
                                className="w-24 h-24 object-cover border border-green-200 rounded bg-white"
                                src={paymentSlip}
                                alt="Payment Slip"
                                onError={(e) => {
                                    console.error('Image load error:', e);
                                    e.target.style.display = 'none';
                                }}
                            />
                            <button
                                onClick={handleDelete}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors duration-200"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {!paymentSlip && !isLoading && (
                <div className="text-center">
                    <input
                        onChange={handleOnChange}
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors duration-200"
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentSlipUpload;
