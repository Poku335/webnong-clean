import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { ChevronDown, LayoutDashboard } from "lucide-react";
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
    <nav className="bg-white shadow-medium border-b border-secondary-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-24">
          {/* Left menu */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <img
                src="https://img2.pic.in.th/pic/1adbc77b-7089-4b42-9349-5adc88518702.md.jpeg"
                alt="E-Commerce Logo"
                className="h-20 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 font-medium px-4 py-2 rounded-lg bg-primary-50 border border-primary-200"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all duration-200"
                }
                to="/"
              >
                Home
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 font-medium px-4 py-2 rounded-lg bg-primary-50 border border-primary-200"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all duration-200"
                }
                to="/shop"
              >
                Shop
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "relative text-orange-600 font-medium px-4 py-2 rounded-lg bg-orange-50 border border-orange-200"
                    : "relative text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-all duration-200"
                }
                to="/cart"
              >
                <span className={`inline-flex items-center gap-2 transition-all duration-300 ${cartBounce ? "animate-cart-bounce" : ""}`}>
                  🛒 Cart
                </span>
                {carts.length > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow-lg transition-all duration-300 ${
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
                className="flex items-center gap-2 hover:bg-secondary-100 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-14 h-14 rounded-full shadow-soft border-2 border-primary-200"
                    src="https://github.com/shadcn.png"
                    alt="user"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-900">
                      {user.fullName || user.name || 'ผู้ใช้'}
                    </p>
                    <p className="text-xs text-secondary-500">{user.email}</p>
                  </div>
                </div>
                <ChevronDown className="text-secondary-600 w-4 h-4" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-large rounded-xl border border-secondary-200 z-50 w-48 animate-fade-in">
                  <div className="p-2">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration-150"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/user/settings"
                      className="block px-4 py-3 hover:bg-primary-50 hover:text-primary-600 text-secondary-700 transition-all duration-150 rounded-lg"
                    >
                      ตั้งค่าบัญชี
                    </Link>
                    <Link
                      to="/user/history"
                      className="block px-4 py-3 hover:bg-primary-50 hover:text-primary-600 text-secondary-700 transition-all duration-150 rounded-lg"
                    >
                      ประวัติการสั่งซื้อ
                    </Link>
                    <button
                      onClick={() => {
                        logout(); 
                        navigate("/login");
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600 text-secondary-700 transition-all duration-150 rounded-lg"
                    >
                      Logout
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
                    ? "text-primary-600 font-medium px-4 py-2 rounded-lg bg-primary-50 border border-primary-200"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all duration-200"
                }
                to="/register"
              >
                Register
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-600 font-medium px-4 py-2 rounded-lg bg-primary-50 border border-primary-200"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all duration-200"
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
