import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserCog,
  SquareChartGantt,
  ShoppingBasket,
  ListOrdered,
  LogOut,
  Home,
  QrCode
} from "lucide-react";

const SidebarAdmin = () => {
  const baseStyle =
    "px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-300 font-medium";

  return (
    <div className="bg-gray-800 w-64 text-gray-100 flex flex-col h-screen shadow-2xl border-r border-orange-100/20">
      {/* Header */}
      <div className="h-24 flex flex-col items-center justify-center border-b border-orange-100/20 bg-orange-400/10">
        <div className="text-2xl font-bold mb-2 text-white">Admin Panel</div>
        {/* ปุ่มกลับหน้าเว็บ */}
        <Link
          to="/"
          className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          <Home className="w-4 h-4" />
          กลับสู่หน้าเว็บ
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-orange-400 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-orange-400/20 hover:text-orange-200 hover:transform hover:-translate-y-0.5`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to={"manage"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-orange-400 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-orange-400/20 hover:text-orange-200 hover:transform hover:-translate-y-0.5`
          }
        >
          <UserCog className="w-5 h-5" />
          Manage
        </NavLink>

        <NavLink
          to={"category"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-orange-400 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-orange-400/20 hover:text-orange-200 hover:transform hover:-translate-y-0.5`
          }
        >
          <SquareChartGantt className="w-5 h-5" />
          Category
        </NavLink>

        <NavLink
          to={"product"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-orange-400 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-orange-400/20 hover:text-orange-200 hover:transform hover:-translate-y-0.5`
          }
        >
          <ShoppingBasket className="w-5 h-5" />
          Product
        </NavLink>

        <NavLink
          to={"orders"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-orange-400 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-orange-400/20 hover:text-orange-200 hover:transform hover:-translate-y-0.5`
          }
        >
          <ListOrdered className="w-5 h-5" />
          Orders
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-orange-100/20">
        <NavLink
          to={"/logout"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-red-500 text-white shadow-lg transform scale-105`
              : `${baseStyle} text-gray-300 hover:bg-red-500/20 hover:text-red-300 hover:transform hover:-translate-y-0.5`
          }
        >
          <LogOut className="w-5 h-5" />
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAdmin;
