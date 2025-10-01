import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { ChevronDown, LayoutDashboard, Settings, History, LogOut } from "lucide-react";
import SearchCard from "./card/SearchCard";


function MainNav() {
  const carts = useEcomStore((s) => s.carts);
  const user = useEcomStore((s) => s.user);
  const logout = useEcomStore((s) => s.logout);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Trigger animation when cart changes
  useEffect(() => {
    if (carts.length > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [carts.length]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-200/50 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Left menu */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center transition-all duration-300 hover:scale-105 hover:opacity-90"
            >
              <img
                src="https://img2.pic.in.th/pic/1adbc77b-7089-4b42-9349-5adc88518702.md.jpeg"
                alt="E-Commerce Logo"
                className="h-16 w-auto rounded-lg shadow-md"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-semibold px-6 py-3 rounded-xl bg-orange-100 border border-orange-200 shadow-sm"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                }
                to="/"
              >
                Home
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-semibold px-6 py-3 rounded-xl bg-orange-100 border border-orange-200 shadow-sm"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                }
                to="/shop"
              >
                Shop
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "relative text-orange-600 font-semibold px-6 py-3 rounded-xl bg-orange-100 border border-orange-200 shadow-sm"
                    : "relative text-gray-600 hover:text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                }
                to="/cart"
              >
                <span className={`inline-flex items-center gap-2 transition-all duration-300 ${cartBounce ? "animate-cart-bounce" : ""}`}>
                  🛒 Cart
                </span>
                {carts.length > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg transition-all duration-300 ${
                      cartBounce ? "animate-pulse scale-110" : ""
                    }`}
                  >
                    {carts.length}
                  </span>
                )}
              </NavLink>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchCard />
          </div>

          {/* User menu */}
          {user ? (
            <div className="flex items-center gap-4 relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-orange-100 px-4 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-orange-200"
                    src="https://github.com/shadcn.png"
                    alt="user"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.fullName || user.name || 'ผู้ใช้'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <ChevronDown className="text-gray-600 w-4 h-4 transition-transform duration-200" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-16 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-orange-200/50 z-50 w-56 animate-zoom-in">
                  <div className="p-3">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/user/settings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">ตั้งค่าบัญชี</span>
                    </Link>
                    <Link
                      to="/user/history"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <History className="w-5 h-5" />
                      <span className="font-medium">ประวัติการสั่งซื้อ</span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        logout(); 
                        navigate("/login");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-100 hover:text-red-600 text-gray-700 transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-semibold px-6 py-3 rounded-xl bg-orange-100 border border-orange-200 shadow-sm"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                }
                to="/register"
              >
                Register
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-white font-semibold px-6 py-3 rounded-xl bg-orange-500 shadow-lg"
                    : "text-white font-semibold px-6 py-3 rounded-xl bg-orange-500 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                }
                to="/login"
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
