// rafce
import { useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Javascript
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  console.log("user form zustand", user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("ยินดีต้อนรับ");
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-secondary-600">ยินดีต้อนรับกลับมา</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                อีเมล
              </label>
              <input
                id="email"
                placeholder="กรอกอีเมลของคุณ"
                className="input-field"
                onChange={handleOnChange}
                name="email"
                type="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                className="input-field"
                onChange={handleOnChange}
                name="password"
                type="password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              ยังไม่มีบัญชี?{' '}
              <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                สมัครสมาชิก
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
