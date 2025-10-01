import { useState } from 'react';
// import { toast } from 'react-toastify'; // Replaced with window.alert
import Resize from 'react-image-file-resizer';
import { uploadUserPaymentSlip } from '../api/userPaymentUpload';
import useEcomStore from '../store/ecom-store';
import { Loader } from 'lucide-react';
import PropTypes from 'prop-types';

const QRCodeUpload = ({ setImage, image, folder = "qr-codes" }) => {
  const token = useEcomStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    setIsLoading(true);
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพ');
        setIsLoading(false);
        return;
      }

      // Image Resize
      Resize.imageFileResizer(
        file,
        720,
        720,
        "JPEG",
        100,
        0,
        (data) => {
          // Upload to backend
          uploadUserPaymentSlip(token, data, folder)
            .then((res) => {
              console.log(res);
              setImage(res.data.url);
              localStorage.setItem('paymentSlip', res.data.url);
              setIsLoading(false);
              // alert('อัปโหลดรูปภาพสำเร็จแล้ว'); // ไม่แสดง alert สำหรับการกระทำปกติ
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
              alert('เกิดข้อผิดพลาดในการอัปโหลด');
            });
        },
        "base64"
      );
    }
  };

  const handleDelete = () => {
    setImage(null);
    localStorage.removeItem('paymentSlip');
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

      {/* Image Preview */}
      {image && !isLoading && (
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-700">อัปโหลดสำเร็จแล้ว</p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <img
                className="w-20 h-20 object-contain border border-gray-200 rounded bg-white"
                src={image}
                alt="Payment Slip"
              />
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!image && !isLoading && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mb-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">อัปโหลดสลิปโอนเงิน</p>
            <p className="text-xs text-gray-500 mb-3">เลือกรูปภาพสลิปโอนเงินของคุณ</p>
            
            <input
              onChange={handleOnChange}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

QRCodeUpload.propTypes = {
  setImage: PropTypes.func.isRequired,
  image: PropTypes.string,
  folder: PropTypes.string
};

export default QRCodeUpload;
