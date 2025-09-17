import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserCog,
  SquareChartGantt,
  ShoppingBasket,
  ListOrdered,
  LogOut,
  Home
} from "lucide-react";

const SidebarAdmin = () => {
  const baseStyle =
    "px-4 py-3 flex items-center gap-2 rounded-md transition-colors duration-200";

  return (
    <div className="bg-gray-800 w-64 text-gray-100 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="h-24 flex flex-col items-center justify-center border-b border-gray-700">
        <div className="text-2xl font-bold mb-2">Admin Panel</div>
        {/* ปุ่มกลับหน้าเว็บ */}
        <Link
          to="/"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          กลับสู่หน้าเว็บ
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-blue-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-blue-500 hover:text-white`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to={"manage"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-blue-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-blue-500 hover:text-white`
          }
        >
          <UserCog className="w-5 h-5" />
          Manage
        </NavLink>

        <NavLink
          to={"category"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-blue-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-blue-500 hover:text-white`
          }
        >
          <SquareChartGantt className="w-5 h-5" />
          Category
        </NavLink>

        <NavLink
          to={"product"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-blue-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-blue-500 hover:text-white`
          }
        >
          <ShoppingBasket className="w-5 h-5" />
          Product
        </NavLink>

        <NavLink
          to={"orders"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-blue-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-blue-500 hover:text-white`
          }
        >
          <ListOrdered className="w-5 h-5" />
          Orders
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-700">
        <NavLink
          to={"/logout"}
          className={({ isActive }) =>
            isActive
              ? `${baseStyle} bg-red-500 text-white`
              : `${baseStyle} text-gray-300 hover:bg-red-500 hover:text-white`
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
