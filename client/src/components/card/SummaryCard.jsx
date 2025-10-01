// rafce
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { listUserCart, saveUserAddress, getUserAddresses, saveOrder, finalizeOrder } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";


const SummaryCard = ({ paymentMethod, paymentSlip }) => {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Form states for new address
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: "",
    isDefault: false
  });

  // Payment states are now passed as props

  const navigate = useNavigate();

  const fetchSavedAddresses = useCallback(async () => {
    try {
      const response = await getUserAddresses(token);
      setSavedAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [token]);

  useEffect(() => {
    hdlGetUserCart(token);
    fetchSavedAddresses();
  }, [token, fetchSavedAddresses]);

  const hdlGetUserCart = (token) => {
    listUserCart(token)
      .then((res) => {
        // console.log(res)
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hdlSaveAddress = (proceedToPayment = false) => {
    // Validate new address form
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.postalCode) {
      return alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
    }
    
    // Validate phone number (10 digits)
    if (!/^[0-9]{10}$/.test(newAddress.phone)) {
      return alert("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 ตัว");
    }
    
    // Validate postal code (5 digits)
    if (!/^[0-9]{5}$/.test(newAddress.postalCode)) {
      return alert("รหัสไปรษณีย์ต้องเป็นตัวเลข 5 ตัว");
    }
    
    console.log("Sending address data:", newAddress);
    console.log("Token:", token);
    saveUserAddress(token, newAddress)
      .then((res) => {
        console.log("Address save response:", res);
        // alert("บันทึกที่อยู่สำเร็จ"); // ไม่แสดง alert สำหรับการกระทำปกติ
        setAddressSaved(true);
        
        // Refresh addresses list
        fetchSavedAddresses();
        
        // If this was called from payment flow, proceed to payment
        if (proceedToPayment) {
          // Check if QR Code payment is selected and has payment slip
          const paymentMethod = localStorage.getItem('selectedPaymentMethod');
          if (paymentMethod === "QR Code") {
            const paymentSlip = localStorage.getItem('paymentSlip');
            if (!paymentSlip) {
              return alert("กรุณาอัปโหลดสลิปโอนเงินก่อน");
            }
          }
          navigate("/user/history");
        }
      })
      .catch((err) => {
        console.error("Address save error:", err);
        console.error("Error response:", err.response?.data);
        const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกที่อยู่";
        alert(errorMessage);
      });
  };
  const hdlGoToPayment = async () => {
    // Check if cart has products
    if (!products || products.length === 0) {
      return alert("ตะกร้าสินค้าว่างเปล่า กรุณาเพิ่มสินค้าก่อนสั่งซื้อ");
    }
    
    // Check if user has selected an address or saved a new one
    if (!addressSaved && !selectedAddress && (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.postalCode)) {
      return alert("กรุณาเลือกหรือกรอกที่อยู่ก่อนจ้า");
    }
    
    // If user entered a new address but didn't save it, save it first
    if (newAddress.fullName && newAddress.phone && newAddress.address && newAddress.postalCode && !addressSaved && !selectedAddress) {
      hdlSaveAddress(true); // Pass true to proceed to payment after save
      return; // Don't proceed to payment yet, let the save complete first
    }
    
    // Check if QR Code payment is selected and has payment slip
    if (paymentMethod === "QR Code" && !paymentSlip) {
      return alert("กรุณาอัปโหลดสลิปโอนเงินก่อน");
    }
    
    try {
      let response;
      
      if (paymentMethod === "QR Code") {
        // For QR Code payment, use saveOrder with payment details
        const orderData = {
          paymentMethod: paymentMethod,
          paymentSlip: paymentSlip,
          paymentStatus: "Pending"
        };
        response = await saveOrder(token, orderData);
      } else {
        // For cash on delivery (ปลายทาง), use finalizeOrder
        response = await finalizeOrder(token);
      }
      
      if (response.data.ok) {
        // const successMessage = response.data.message || "สั่งซื้อสำเร็จ!";
        // toast.success(successMessage); // ไม่แสดง success message
        clearCart();
        navigate("/user/history");
      } else {
        const errorMessage = response.data.message || "เกิดข้อผิดพลาดในการสั่งซื้อ";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Order error:", error);
      let errorMessage = "เกิดข้อผิดพลาดในการสั่งซื้อ";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      } else if (error.response?.status === 500) {
        errorMessage = "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง";
      }
      
      toast.error(errorMessage);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressSaved(true);
    // alert("เลือกที่อยู่สำเร็จ"); // ไม่แสดง alert สำหรับการกระทำปกติ
  };


  // Get button text and disabled state
  const getPaymentButtonState = () => {
    // Check if cart is empty
    if (!products || products.length === 0) {
      return {
        text: "ตะกร้าสินค้าว่างเปล่า",
        disabled: true
      };
    }

    // Check if address is not selected
    if (!addressSaved && !selectedAddress && (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.postalCode)) {
      return {
        text: "กรุณาเลือกหรือกรอกที่อยู่ก่อน",
        disabled: true
      };
    }

    // Check if QR Code payment needs payment slip
    if (paymentMethod === "QR Code" && !paymentSlip) {
      return {
        text: "กรุณาอัปโหลดสลิปโอนเงินก่อน",
        disabled: true
      };
    }

    return {
      text: "ยืนยันการสั่งซื้อ",
      disabled: false
    };
  };

  console.log(products);

  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">ที่อยู่ในการจัดส่ง</h2>
        </div>
        
        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">เลือกที่อยู่ที่เคยใช้</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedAddress?.id === addr.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            หลัก
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                      <p className="text-sm text-gray-600">{addr.postalCode}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAddress(addr);
                      }}
                      className="btn-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-colors duration-200"
                    >
                      ใช้ที่อยู่นี้
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showAddressForm ? "ซ่อน" : "เพิ่มที่อยู่ใหม่"}
              </button>
            </div>
          </div>
        )}

        {/* ฟอร์มกรอกที่อยู่ใหม่ - แสดงอัตโนมัติถ้าไม่มีที่อยู่เก่า */}
        {(showAddressForm || savedAddresses.length === 0) && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">
              {savedAddresses.length === 0 ? "กรอกที่อยู่ในการจัดส่ง" : "เพิ่มที่อยู่ใหม่"}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    maxLength="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="กรอกเบอร์โทรศัพท์ 10 ตัว"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่ *
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรอกที่อยู่"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสไปรษณีย์ *
                </label>
                <input
                  type="text"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรอกรหัสไปรษณีย์ 5 ตัว"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  ตั้งเป็นที่อยู่หลัก
                </label>
              </div>

              <button
                onClick={() => hdlSaveAddress()}
                className="btn-primary"
              >
                บันทึกที่อยู่
              </button>
            </div>
          </div>
        )}

        {/* แสดงที่อยู่ที่เลือก */}
        {selectedAddress && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <h3 className="font-medium text-green-800 mb-1">ที่อยู่ที่เลือก</h3>
            <p className="text-sm text-green-700">{selectedAddress.fullName}</p>
            <p className="text-sm text-green-700">{selectedAddress.phone}</p>
            <p className="text-sm text-green-700">{selectedAddress.address}</p>
            <p className="text-sm text-green-700">{selectedAddress.postalCode}</p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">สรุปคำสั่งซื้อ</h2>
        </div>

        {/* Item List */}
        <div className="space-y-2 mb-4">
          {products?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.title}</p>
                <p className="text-sm text-gray-600">
                  จำนวน: {item.count} x {numberFormat(item.product.price)} บาท
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-bold">
                  {numberFormat(item.count * item.product.price)} บาท
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method Status */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-medium text-blue-800">วิธีการชำระเงิน: {paymentMethod}</span>
          </div>
          
          {paymentMethod === "QR Code" && (
            <div className="text-sm">
              {paymentSlip ? (
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>สลิปโอนเงินอัปโหลดแล้ว</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>กรุณาอัปโหลดสลิปโอนเงิน</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ค่าจัดส่ง:</span>
            <span className="text-gray-900">ฟรี</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ส่วนลด:</span>
            <span className="text-gray-900">0.00 บาท</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">ยอดรวมสุทธิ:</span>
            <span className="text-gray-900 font-bold text-lg">{numberFormat(cartTotal)} บาท</span>
          </div>
        </div>

        {/* Payment Button */}
        {(() => {
          const buttonState = getPaymentButtonState();
          return (
            <button
              onClick={hdlGoToPayment}
              disabled={buttonState.disabled}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 ${
                buttonState.disabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {buttonState.text}
            </button>
          );
        })()}
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  paymentMethod: PropTypes.string,
  paymentSlip: PropTypes.string,
};

export default SummaryCard;
