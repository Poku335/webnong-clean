import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { 
  QrCode, 
  Upload, 
  Trash, 
  Loader, 
  Image as ImageIcon,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";
import Resize from "react-image-file-resizer";

export default function QRCodeManagement() {
  const token = useEcomStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);

  useEffect(() => {
    // Load existing QR Code from localStorage or API
    const savedQRCode = localStorage.getItem('admin_qr_code');
    if (savedQRCode) {
      setQrCodeImage(savedQRCode);
    }
  }, []);

  const handleQRCodeUpload = (e) => {
    setIsLoading(true);
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพ');
        setIsLoading(false);
        return;
      }

      Resize.imageFileResizer(
        file,
        720,
        720,
        "JPEG",
        100,
        0,
        (data) => {
          uploadFiles(token, data, "qr-codes")
            .then((res) => {
              console.log(res);
              setQrCodeImage(res.data.url);
              localStorage.setItem('admin_qr_code', res.data.url);
              setIsLoading(false);
              // alert('อัปโหลด QR Code สำเร็จ'); // ไม่แสดง alert สำหรับการกระทำปกติ
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

  const handleDeleteQRCode = () => {
    setQrCodeImage(null);
    localStorage.removeItem('admin_qr_code');
    // alert('ลบ QR Code แล้ว'); // ไม่แสดง alert สำหรับการกระทำปกติ
  };

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
                <QrCode className="w-8 h-8 text-orange-500" />
                จัดการ QR Code
              </h1>
              <p className="text-gray-600">จัดการ QR Code สำหรับการชำระเงิน</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl ${
                qrCodeImage 
                  ? 'bg-green-100' 
                  : 'bg-yellow-100'
              }`}>
                <span className={`font-semibold text-sm ${
                  qrCodeImage 
                    ? 'text-green-700' 
                    : 'text-yellow-700'
                }`}>
                  {qrCodeImage ? 'มี QR Code' : 'ไม่มี QR Code'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current QR Code */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">QR Code ปัจจุบัน</h2>
            </div>
            
            {qrCodeImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="relative group">
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="w-48 h-48 object-contain border-2 border-gray-200 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => window.open(qrCodeImage, '_blank')}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        ดูขนาดใหญ่
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => window.open(qrCodeImage, '_blank')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    ดูขนาดใหญ่
                  </button>
                  <button
                    onClick={handleDeleteQRCode}
                    className="btn-sm bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                  >
                    <Trash className="w-4 h-4" />
                    ลบ QR Code
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">ยังไม่มี QR Code</p>
                <p className="text-gray-400 text-sm">กรุณาอัปโหลด QR Code ของธนาคาร</p>
              </div>
            )}
          </div>

          {/* Upload New QR Code */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">อัปโหลด QR Code ใหม่</h2>
            </div>
            
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-orange-400 transition-colors duration-300">
                <div className="text-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader className="w-12 h-12 animate-spin text-orange-500" />
                      <p className="text-orange-600 font-medium">กำลังอัปโหลด...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-semibold mb-1">อัปโหลด QR Code</p>
                        <p className="text-gray-500 text-sm">เลือกรูปภาพ QR Code ของธนาคาร</p>
                      </div>
                      <input
                        onChange={handleQRCodeUpload}
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-colors duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">คำแนะนำ</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• รองรับไฟล์รูปภาพ: JPG, PNG, GIF</li>
                      <li>• ขนาดไฟล์ไม่เกิน 5MB</li>
                      <li>• QR Code จะถูกปรับขนาดเป็น 720x720 pixels</li>
                      <li>• ควรเป็น QR Code ของธนาคารที่ชัดเจน</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
