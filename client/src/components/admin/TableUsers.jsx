// rafce
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldCheck,
  Mail,
  Settings,
  Search,
  Filter
} from "lucide-react";
import { getListAllUsers, changeUserStatus, changeUserRole } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
// import { toast } from "react-toastify"; // Replaced with window.alert

const TableUsers = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    handleGetUsers(token);
  }, []);

  const handleGetUsers = (token) => {
    getListAllUsers(token)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  const handleChangeUserStatus = (userId, userStatus) => {
    const value = { id: userId, enabled: !userStatus };
    changeUserStatus(token, value)
      .then((res) => {
        handleGetUsers(token);

      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, userRole) => {
    const value = { id: userId, role: userRole };
    changeUserRole(token, value)
      .then((res) => {
        handleGetUsers(token);

      })
      .catch((err) => console.log(err));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && user.enabled) ||
      (statusFilter === "INACTIVE" && !user.enabled);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-400" />
                จัดการผู้ใช้งาน
              </h1>
              <p className="text-gray-600">จัดการสิทธิ์และสถานะของผู้ใช้งานทั้งหมด</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 px-4 py-2 rounded-xl">
                <span className="text-orange-600 font-semibold text-sm">ทั้งหมด: {users.length}</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-xl">
                <span className="text-green-700 font-semibold text-sm">ใช้งาน: {users.filter(u => u.enabled).length}</span>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-xl">
                <span className="text-blue-700 font-semibold text-sm">Admin: {users.filter(u => u.role === 'admin').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                ค้นหา
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยอีเมลหรือชื่อ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                สิทธิ์
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                สถานะ
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="ACTIVE">ใช้งาน</option>
                <option value="INACTIVE">ปิดใช้งาน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[800px]">
              <thead className="bg-orange-50">
                <tr>
                  <th className="w-16 px-3 py-4 text-center text-xs font-bold text-gray-900"></th>
                  <th className="w-64 px-3 py-4 text-left text-xs font-bold text-gray-900">
                    <Mail className="w-4 h-4 inline mr-1" />
                    อีเมล
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <Shield className="w-4 h-4 inline mr-1" />
                    สิทธิ์
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold text-gray-900">สถานะ</th>
                  <th className="w-40 px-3 py-4 text-center text-xs font-bold text-gray-900">
                    <Settings className="w-4 h-4 inline mr-1" />
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredUsers?.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-orange-50/50 transition-all duration-300"
                    >
                      <td className="px-3 py-4 text-xs font-semibold text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm truncate">{user.email}</p>
                            <p className="text-xs text-gray-500 truncate">{user.name || 'ไม่มีชื่อ'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <select
                          onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                          value={user.role}
                          className="input-field text-xs py-1 px-2 w-full"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          user.enabled 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {user.enabled ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              ใช้งาน
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              ปิดใช้งาน
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button
                          className={`btn-sm font-medium transition-all duration-200 ${
                            user.enabled 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                          onClick={() => handleChangeUserStatus(user.id, user.enabled)}
                        >
                          {user.enabled ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TableUsers;
