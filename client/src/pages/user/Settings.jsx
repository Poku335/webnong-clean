// rafce
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify"; // Replaced with window.alert
import useEcomStore from "../../store/ecom-store";
import axios from "axios";

const Settings = () => {
  const { user, token } = useEcomStore();
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    setValue: setValueProfile,
  } = useForm();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    reset: resetAddress,
  } = useForm();

  useEffect(() => {
    if (user) {
      setValueProfile("fullName", user.fullName || "");
      setValueProfile("phone", user.phone || "");
    }
    fetchAddresses();
  }, [user, setValueProfile]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/user/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const onSubmitProfile = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5002/api/user/profile",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // alert(response.data.message); // ไม่แสดง alert สำหรับการกระทำปกติ
      // อัปเดต user ใน store
      useEcomStore.getState().setUser(response.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAddress = async (data) => {
    setLoading(true);
    try {
      if (editingAddress) {
        // อัปเดตที่อยู่
        await axios.put(
          `http://localhost:5002/api/user/addresses/${editingAddress.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // alert("อัปเดตที่อยู่สำเร็จ"); // ไม่แสดง alert สำหรับการกระทำปกติ
      } else {
        // เพิ่มที่อยู่ใหม่
        await axios.post(
          "http://localhost:5002/api/user/addresses",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // alert("เพิ่มที่อยู่สำเร็จ"); // ไม่แสดง alert สำหรับการกระทำปกติ
      }
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddress();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
    resetAddress({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("คุณต้องการลบที่อยู่นี้หรือไม่?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5002/api/user/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // alert("ลบที่อยู่สำเร็จ"); // ไม่แสดง alert สำหรับการกระทำปกติ
      fetchAddresses();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddress();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50">
          <div className="px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ตั้งค่าบัญชี</h1>
            </div>

            {/* Profile Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลส่วนตัว</h2>
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    {...registerProfile("fullName", { required: "กรุณากรอกชื่อ-นามสกุล" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                  {errorsProfile.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errorsProfile.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">ไม่สามารถแก้ไขอีเมลได้</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    {...registerProfile("phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </form>
            </div>

            {/* Address Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">จัดการที่อยู่</h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  disabled={addresses.length >= 5}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  เพิ่มที่อยู่ใหม่
                </button>
              </div>

              {addresses.length >= 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    คุณได้บันทึกที่อยู่ครบ 5 ที่อยู่แล้ว (ขีดจำกัดสูงสุด)
                  </p>
                </div>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
                  </h3>
                  <form onSubmit={handleSubmitAddress(onSubmitAddress)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ชื่อ-นามสกุล *
                        </label>
                        <input
                          {...registerAddress("fullName", { required: "กรุณากรอกชื่อ-นามสกุล" })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="กรอกชื่อ-นามสกุล"
                        />
                        {errorsAddress.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errorsAddress.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          เบอร์โทรศัพท์ *
                        </label>
                        <input
                          {...registerAddress("phone", { 
                            required: "กรุณากรอกเบอร์โทรศัพท์",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 ตัว"
                            }
                          })}
                          type="tel"
                          maxLength="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="กรอกเบอร์โทรศัพท์ 10 ตัว"
                        />
                        {errorsAddress.phone && (
                          <p className="text-red-500 text-sm mt-1">{errorsAddress.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ที่อยู่ *
                      </label>
                      <textarea
                        {...registerAddress("address", { required: "กรุณากรอกที่อยู่" })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="กรอกที่อยู่"
                      />
                      {errorsAddress.address && (
                        <p className="text-red-500 text-sm mt-1">{errorsAddress.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        รหัสไปรษณีย์ *
                      </label>
                      <input
                        {...registerAddress("postalCode", { 
                          required: "กรุณากรอกรหัสไปรษณีย์",
                          pattern: {
                            value: /^[0-9]{5}$/,
                            message: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 ตัว"
                          }
                        })}
                        type="text"
                        maxLength="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="กรอกรหัสไปรษณีย์ 5 ตัว"
                      />
                      {errorsAddress.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errorsAddress.postalCode.message}</p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        {...registerAddress("isDefault")}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        ตั้งเป็นที่อยู่หลัก
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {loading ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddress}
                        className="btn-secondary"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              หลัก
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                        <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.postalCode}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="btn-sm bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg transition-colors duration-200"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="btn-sm bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-colors duration-200"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>ยังไม่มีที่อยู่ที่บันทึกไว้</p>
                    <p className="text-sm">คลิก "เพิ่มที่อยู่ใหม่" เพื่อเพิ่มที่อยู่แรกของคุณ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
