// rafce
import { useState } from "react";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../api/auth";

const Login = () => {
  // Javascript
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  // const user = useEcomStore((state) => state.user); // Not used
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      
      // ดึงข้อมูล user ที่สมบูรณ์
      const userRes = await currentUser(res.data.token);
      useEcomStore.getState().setUser(userRes.data.user);
      
      roleRedirect(role);
      // alert("ยินดีต้อนรับ! 🎉"); // ไม่แสดง alert สำหรับการกระทำปกติ
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 relative overflow-hidden"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">กลับ</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-gray-600 text-lg">ยินดีต้อนรับกลับมา</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  placeholder="กรอกอีเมลของคุณ"
                  className="input-field"
                  onChange={handleOnChange}
                  name="email"
                  type="email"
                  required
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  className="input-field"
                  onChange={handleOnChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ยังไม่มีบัญชี?{' '}
              <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                สมัครสมาชิก
              </Link>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-300 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-orange-300 rounded-full opacity-20"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
