# 🏦 Payment Slip Upload System

## 📋 ระบบอัปโหลดสลิปโอนเงินสำหรับ QR Code Payment

### 🎯 **วัตถุประสงค์**
สร้างระบบอัปโหลดสลิปโอนเงินสำหรับการชำระเงินผ่าน QR Code โดยใช้วิธีการเดียวกับการอัปโหลดรูปภาพสินค้า

---

## 🔧 **วิธีการทำงาน**

### **1. Frontend Upload Process**
```javascript
// client/src/components/PaymentSlipUpload.jsx
const handleOnChange = (e) => {
    const file = files[0];
    
    // 1. Validate file type
    if (!file.type.startsWith('image/')) {
        toast.error('กรุณาเลือกไฟล์รูปภาพ');
        return;
    }
    
    // 2. Resize image (720x720, JPEG, 100% quality)
    Resize.imageFileResizer(
        file, 720, 720, "JPEG", 100, 0,
        (data) => {
            // 3. Upload to Cloudinary
            uploadUserPaymentSlip(token, data, "payment-slips")
                .then((res) => {
                    setPaymentSlip(res.data.url); // เก็บ URL
                    toast.success('อัปโหลดสำเร็จ');
                });
        },
        "base64"
    );
};
```

### **2. Backend API**
```javascript
// server/routes/product.js
router.post('/user-payment-upload', authCheck, createImages);

// server/controllers/product.js
exports.createImages = async (req, res) => {
    const { image, folder } = req.body;
    const folderName = folder || 'Ecom2024';
    
    const result = await cloudinary.uploader.upload(image, {
        public_id: `Roitai-${Date.now()}`,
        resource_type: 'auto',
        folder: folderName
    });
    res.send(result); // ส่งกลับ URL
};
```

### **3. Database Storage**
```prisma
// server/prisma/schema.prisma
model Order {
    id            Int      @id @default(autoincrement())
    cartTotal     Float
    orderStatus   String   @default("Not Process")
    paymentMethod String   @default("ปลายทาง")
    paymentStatus String   @default("pending")
    qrCodeImage   String?  // URL ของ QR Code
    paymentSlip   String?  // URL ของสลิปโอนเงิน ← ใหม่!
    orderedById   Int
    orderedBy     User     @relation(fields: [orderedById], references: [id])
    productsOnOrders ProductOnOrder[]
}
```

### **4. Admin Display**
```javascript
// client/src/components/admin/TableOrders.jsx
<td className="px-4 py-2 border text-center">
    {item.paymentSlip ? (
        <div className="flex flex-col items-center space-y-1">
            <img
                src={item.paymentSlip}
                alt="Payment Slip"
                className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                onClick={() => window.open(item.paymentSlip, '_blank')}
                title="คลิกเพื่อดูรูปภาพเต็ม"
            />
            <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => window.open(item.paymentSlip, '_blank')}>
                ดูรูปภาพ
            </span>
        </div>
    ) : (
        <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <span className="text-xs text-gray-400">ไม่มี</span>
        </div>
    )}
</td>
```

---

## 🚀 **การใช้งาน**

### **1. สำหรับลูกค้า (Checkout)**
1. เลือกวิธีการชำระเงิน "QR Code"
2. อัปโหลดสลิปโอนเงิน
3. กดปุ่ม "ดำเนินการชำระเงิน"
4. ระบบจะบันทึก order พร้อม paymentSlip URL

### **2. สำหรับแอดมิน (Admin Panel)**
1. ไปที่หน้า "จัดการคำสั่งซื้อ" (`/admin/orders`)
2. ดูคอลัมน์ "สลิปโอนเงิน"
3. คลิกที่รูปภาพเพื่อดูขนาดเต็ม
4. เปลี่ยนสถานะจาก "รอดำเนินการ" เป็น "ชำระเงินแล้ว"

---

## 📁 **ไฟล์ที่เกี่ยวข้อง**

### **Frontend**
- `client/src/components/PaymentSlipUpload.jsx` - Component อัปโหลดสลิป
- `client/src/api/userPaymentUpload.jsx` - API สำหรับอัปโหลด
- `client/src/components/CheckoutForm.jsx` - ฟอร์มชำระเงิน
- `client/src/components/admin/TableOrders.jsx` - ตารางแสดงคำสั่งซื้อ

### **Backend**
- `server/routes/product.js` - Routes สำหรับอัปโหลด
- `server/controllers/product.js` - Controller สำหรับอัปโหลด
- `server/controllers/user.js` - Controller สำหรับบันทึก order
- `server/controllers/admin.js` - Controller สำหรับดึงข้อมูล order

### **Database**
- `server/prisma/schema.prisma` - Schema ของฐานข้อมูล

---

## 🧪 **การทดสอบ**

### **1. Quick Test**
```bash
node quick-test.js
```

### **2. Manual Test**
1. เริ่มเซิร์ฟเวอร์: `cd server && npm start`
2. เริ่มไคลเอนต์: `cd client && npm run dev`
3. ทดสอบการชำระเงินผ่าน QR Code
4. ตรวจสอบในหน้าแอดมิน

### **3. API Test**
```bash
node test-api.js
```

---

## ✅ **สถานะระบบ**

- ✅ **Frontend Components** - พร้อมใช้งาน
- ✅ **Backend API** - พร้อมใช้งาน  
- ✅ **Database Schema** - พร้อมใช้งาน
- ✅ **Admin Display** - พร้อมใช้งาน
- ✅ **File Upload** - พร้อมใช้งาน
- ✅ **Image Display** - พร้อมใช้งาน

---

## 🎉 **สรุป**

ระบบอัปโหลดสลิปโอนเงินทำงานได้สมบูรณ์แล้ว โดยใช้วิธีการเดียวกับการอัปโหลดรูปภาพสินค้า:

1. **อัปโหลด**: ลูกค้าอัปโหลดสลิปโอนเงินผ่าน QR Code payment
2. **จัดเก็บ**: ระบบบันทึก URL ลงในฐานข้อมูล
3. **แสดงผล**: แอดมินสามารถดูสลิปโอนเงินในหน้า Orders Management
4. **จัดการ**: แอดมินสามารถเปลี่ยนสถานะการชำระเงินได้

ระบบพร้อมใช้งานแล้ว! 🚀
