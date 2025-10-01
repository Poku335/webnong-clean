import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/auth";

const Layout = () => {
  const { token, setUser } = useEcomStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await currentUser(token);
          setUser(res.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [token, setUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="container-custom py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">E-Commerce</h3>
              <p className="text-gray-300 mb-4">
                ร้านค้าออนไลน์ที่ให้บริการสินค้าคุณภาพสูง ราคาเป็นมิตร
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl">📱</span>
                <span className="text-2xl">📧</span>
                <span className="text-2xl">🌐</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">เมนูหลัก</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-orange-300 transition-colors">หน้าแรก</a></li>
                <li><a href="/shop" className="hover:text-orange-300 transition-colors">ร้านค้า</a></li>
                <li><a href="/cart" className="hover:text-orange-300 transition-colors">ตะกร้า</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">บัญชีผู้ใช้</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/login" className="hover:text-orange-300 transition-colors">เข้าสู่ระบบ</a></li>
                <li><a href="/register" className="hover:text-orange-300 transition-colors">สมัครสมาชิก</a></li>
                <li><a href="/user/history" className="hover:text-orange-300 transition-colors">ประวัติการสั่งซื้อ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">ติดต่อเรา</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Tel:02-123-4567</li>
                <li>ติดต่อ:น้องเอิร์น.com</li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-700 my-8" />
          
          <div className="text-center text-gray-400">
            <p>มอใหม่ ฟิชชิ่ง</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
