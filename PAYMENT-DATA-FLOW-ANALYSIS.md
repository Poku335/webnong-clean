# 🔍 Payment Data Flow Analysis - ระดับความละเอียดสูงสุด

## 📋 **Executive Summary**

หลังจากอัปโหลดสลิปโอนเงินและกดยืนยันการชำระเงินแล้ว ข้อมูลจะถูกเก็บไว้ใน **3 ที่หลัก**:
1. **Cloudinary** - รูปภาพสลิปโอนเงิน
2. **PostgreSQL Database** - ข้อมูล order และ payment slip URL
3. **Browser LocalStorage** - ข้อมูลชั่วคราว

---

## 🗄️ **1. Cloudinary Storage (รูปภาพ)**

### **ที่เก็บ:**
```
Cloudinary Account: dn4sjmk7p
Folder: payment-slips/
Public ID: Roitai-{timestamp}
URL Format: https://res.cloudinary.com/dn4sjmk7p/image/upload/v{version}/payment-slips/Roitai-{timestamp}.jpg
```

### **ข้อมูลที่เก็บ:**
- ✅ **รูปภาพสลิปโอนเงิน** (resized 720x720, JPEG, 100% quality)
- ✅ **Metadata** (upload time, file size, format)
- ✅ **Public ID** สำหรับการจัดการ
- ✅ **Secure URL** สำหรับการเข้าถึง

### **Code Path:**
```javascript
// client/src/components/PaymentSlipUpload.jsx
Resize.imageFileResizer(file, 720, 720, "JPEG", 100, 0, (data) => {
  uploadUserPaymentSlip(token, data, "payment-slips")
    .then((res) => {
      setPaymentSlip(res.data.url); // เก็บ URL ใน state
      localStorage.setItem('paymentSlip', res.data.url); // เก็บใน localStorage
    });
});
```

---

## 🗄️ **2. PostgreSQL Database (ข้อมูล Order)**

### **Table: Order**
```sql
CREATE TABLE "Order" (
  id            SERIAL PRIMARY KEY,
  cartTotal     FLOAT NOT NULL,
  orderStatus   VARCHAR DEFAULT 'Not Process',
  createdAt     TIMESTAMP DEFAULT NOW(),
  updatedAt     TIMESTAMP DEFAULT NOW(),
  amount        FLOAT,
  status        VARCHAR,
  currentcy     VARCHAR,
  paymentMethod VARCHAR DEFAULT 'ปลายทาง',
  paymentStatus VARCHAR DEFAULT 'pending',
  qrCodeImage   VARCHAR,  -- URL ของ QR Code
  paymentSlip   VARCHAR,  -- URL ของสลิปโอนเงิน ← เก็บที่นี่!
  orderedById   INTEGER REFERENCES "User"(id)
);
```

### **ข้อมูลที่เก็บ:**
- ✅ **Order ID** (Auto-increment)
- ✅ **Cart Total** (ยอดรวม)
- ✅ **Order Status** ("Pending" สำหรับ QR Code)
- ✅ **Payment Method** ("QR Code")
- ✅ **Payment Status** ("pending")
- ✅ **QR Code Image URL** (ถ้ามี)
- ✅ **Payment Slip URL** ← **ข้อมูลหลัก!**
- ✅ **User ID** (ผู้สั่งซื้อ)
- ✅ **Created/Updated Timestamps**

### **Code Path:**
```javascript
// server/controllers/user.js - exports.saveOrder
const order = await prisma.order.create({
  data: {
    // ... other fields
    paymentMethod: "QR Code",
    paymentStatus: "pending",
    qrCodeImage: qrCodeImage,
    paymentSlip: paymentSlip, // ← เก็บ URL ที่นี่!
  },
});
```

---

## 🗄️ **3. Browser LocalStorage (ข้อมูลชั่วคราว)**

### **ที่เก็บ:**
```javascript
localStorage.setItem('paymentSlip', 'https://res.cloudinary.com/.../payment-slips/Roitai-123456.jpg');
localStorage.setItem('paymentMethod', 'QR Code');
localStorage.setItem('qrCodeImage', 'https://example.com/qr.jpg');
```

### **ข้อมูลที่เก็บ:**
- ✅ **Payment Slip URL** (ชั่วคราว)
- ✅ **Payment Method** (ชั่วคราว)
- ✅ **QR Code Image** (ชั่วคราว)
- ✅ **User Token** (สำหรับ authentication)

---

## 🔄 **Data Flow Process**

### **Step 1: Image Upload**
```
User Upload → Resize (720x720) → Cloudinary → Get URL → Store in State
```

### **Step 2: Order Creation**
```
Form Submit → API Call → Database Insert → Cart Clear → Success Response
```

### **Step 3: Data Storage**
```
Payment Slip URL → Order Table → Admin Panel Display
```

---

## 📊 **Data Retrieval Process**

### **Admin Panel Display:**
```javascript
// server/controllers/admin.js - exports.getOrderAdmin
const orders = await prisma.order.findMany({
  include: {
    productsOnOrders: { include: { product: true } },
    orderedBy: { select: { id: true, email: true, address: true } }
  }
});

// Map orders to include paymentSlip
const mappedOrders = orders.map(order => ({
  ...order,
  paymentSlip: order.paymentMethod === "QR Code" ? order.paymentSlip : null
}));
```

### **Frontend Display:**
```javascript
// client/src/components/admin/TableOrders.jsx
{item.paymentSlip ? (
  <img
    src={item.paymentSlip}
    alt="Payment Slip"
    onClick={() => window.open(item.paymentSlip, '_blank')}
  />
) : (
  <div>ไม่มี</div>
)}
```

---

## 🔍 **Detailed Data Locations**

### **1. Cloudinary Storage**
- **Account**: `dn4sjmk7p`
- **Folder**: `payment-slips/`
- **File Format**: `Roitai-{timestamp}.jpg`
- **Access**: Public URL
- **Retention**: Permanent (until manually deleted)

### **2. Database Storage**
- **Table**: `Order`
- **Field**: `paymentSlip` (VARCHAR)
- **Value**: Cloudinary URL
- **Index**: Primary key on `id`
- **Retention**: Permanent (until order deleted)

### **3. LocalStorage**
- **Key**: `paymentSlip`
- **Value**: Cloudinary URL
- **Scope**: Browser session
- **Retention**: Until cleared or browser reset

---

## ⚠️ **Potential Issues & Solutions**

### **Issue 1: Image Not Displaying**
**Cause**: Cloudinary URL invalid or expired
**Solution**: 
```javascript
// Check URL validity
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### **Issue 2: Database Not Updated**
**Cause**: API call failed or database error
**Solution**:
```javascript
// Add error handling
.catch((err) => {
  console.error('Database update failed:', err);
  toast.error('Failed to save order');
});
```

### **Issue 3: LocalStorage Cleared**
**Cause**: Browser cleared or session expired
**Solution**:
```javascript
// Check localStorage before using
const paymentSlip = localStorage.getItem('paymentSlip');
if (!paymentSlip) {
  // Re-upload or show error
}
```

---

## 🎯 **Recommended Improvements**

### **1. Data Validation**
```javascript
const validatePaymentSlip = (url) => {
  return url && url.includes('cloudinary.com') && url.includes('payment-slips');
};
```

### **2. Error Recovery**
```javascript
const handlePaymentSlipError = (error) => {
  console.error('Payment slip error:', error);
  // Show user-friendly message
  // Option to re-upload
};
```

### **3. Data Backup**
```javascript
// Backup payment slip URL in multiple places
localStorage.setItem('paymentSlip', url);
sessionStorage.setItem('paymentSlip', url);
// Database already stores it
```

### **4. Monitoring**
```javascript
// Track payment slip uploads
const trackPaymentSlipUpload = (url) => {
  console.log('Payment slip uploaded:', url);
  // Send analytics event
};
```

---

## 📋 **Summary**

### **Data Storage Locations:**
1. **Cloudinary** - รูปภาพสลิปโอนเงิน (Permanent)
2. **PostgreSQL** - Order record with paymentSlip URL (Permanent)
3. **LocalStorage** - Temporary storage (Session-based)

### **Data Flow:**
```
Upload → Cloudinary → Get URL → Store in Database → Display in Admin
```

### **Key Fields:**
- **Order.paymentSlip** - Cloudinary URL
- **Order.paymentMethod** - "QR Code"
- **Order.paymentStatus** - "pending"
- **Order.orderStatus** - "Pending"

**🎯 ข้อมูลสลิปโอนเงินจะถูกเก็บไว้ใน 3 ที่หลัก และสามารถเข้าถึงได้ผ่าน Admin Panel!**
