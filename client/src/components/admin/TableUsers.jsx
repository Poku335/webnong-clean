// rafce
import { useState, useEffect } from "react";
import { getListAllUsers, changeUserStatus, changeUserRole } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const TableUsers = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);

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
        toast.success("Update Status Success!!");
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, userRole) => {
    const value = { id: userId, role: userRole };
    changeUserRole(token, value)
      .then((res) => {
        handleGetUsers(token);
        toast.success("Update Role Success!!");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">จัดการผู้ใช้งาน</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2 border">ลำดับ</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">สิทธิ์</th>
              <th className="px-4 py-2 border">สถานะ</th>
              <th className="px-4 py-2 border">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((el, i) => (
              <tr key={el.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 border text-center">{i + 1}</td>
                <td className="px-4 py-2 border">{el.email}</td>
                <td className="px-4 py-2 border text-center">
                  <select
                    onChange={(e) => handleChangeUserRole(el.id, e.target.value)}
                    value={el.role}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      el.enabled ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {el.enabled ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className={`px-3 py-1 rounded-md shadow-md text-white font-medium transition-transform duration-200 hover:scale-105 ${
                      el.enabled ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleChangeUserStatus(el.id, el.enabled)}
                  >
                    {el.enabled ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUsers;
