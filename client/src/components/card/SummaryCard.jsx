// rafce
import React, { useState, useEffect } from "react";
import { listUserCart, saveAddress, getUserAddresses } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";


const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    hdlGetUserCart(token);
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await getUserAddresses(token);
      setSavedAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

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

  const hdlSaveAddress = () => {
    if (!address) {
      return toast.warning("Please fill address");
    }
    saveAddress(token, address)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        setAddressSaved(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hdlGoToPayment = () => {
    if (!addressSaved && !selectedAddress) {
      return toast.warning("กรุณาเลือกหรือกรอกที่อยู่ก่อนจ้า");
    }
    navigate("/user/payment");
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressSaved(true);
    toast.success("เลือกที่อยู่สำเร็จ");
  };

  console.log(products);

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap gap-4">
        {/* Left */}
        <div className="w-2/4">
          <div
            className="bg-gray-100 p-4 rounded-md 
          border shadow-md space-y-4"
          >
            <h1 className="font-bold text-lg">ที่อยู่ในการจัดส่ง</h1>
            
            {/* แสดงที่อยู่ที่บันทึกไว้ */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-medium text-md">เลือกที่อยู่ที่เคยใช้</h2>
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
                            <span className="font-medium">{addr.fullName}</span>
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
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
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

            {/* ฟอร์มกรอกที่อยู่ใหม่ */}
            {showAddressForm && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">เพิ่มที่อยู่ใหม่</h3>
                <textarea
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="กรุณากรอกที่อยู่"
                  className="w-full px-2 rounded-md"
                />
                <button
                  onClick={hdlSaveAddress}
                  className="bg-blue-500 text-white
                px-4 py-2 rounded-md shadow-md hover:bg-blue-700
                hover:scale-105 hover:translate-y-1 hover:duration-200 mt-2"
                >
                  Save Address
                </button>
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
        </div>

        {/* Right */}
        <div className="w-2/4">
          <div
            className="bg-gray-100 p-4 rounded-md 
          border shadow-md space-y-4"
          >
            <h1 className="text-lg font-bold">คำสั่งซื้อของคุณ</h1>

            {/* Item List */}

            {products?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold">{item.product.title}</p>
                    <p className="text-sm">
                      จำนวน : {item.count} x {numberFormat(item.product.price) }
                    </p>
                  </div>

                  <div>
                    <p className="text-red-500 font-bold">
                      { numberFormat(item.count * item.product.price)     }
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div>
              <div className="flex justify-between">
                <p>ค่าจัดส่ง:</p>
                <p>0.00</p>
              </div>
              <div className="flex justify-between">
                <p>ส่วนลด:</p>
                <p>0.00</p>
              </div>
            </div>

            <hr />
            <div>
              <div className="flex justify-between">
                <p className="font-bold">ยอดรวมสุทธิ:</p>
                <p className="text-red-500 font-bold text-lg">{numberFormat(cartTotal) }</p>
              </div>
            </div>

            <hr />
            <div>
              <button
                onClick={hdlGoToPayment}
                // disabled={!addressSaved}
                className="bg-green-400 w-full p-2 rounded-md
              shadow-md text-white hover:bg-green-600"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
