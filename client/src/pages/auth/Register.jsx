// rafce
import { useState, useEffect } from "react";
import axios from "axios";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    fullName: z.string().min(1, { message: "กรุณากรอกชื่อ-นามสกุล" }),
    email: z.string().email({ message: "Invalid email!!!" }),
    phone: z.string().optional().refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 ตัว"
    }),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password มันบ่ตรงกันเด้อ",
    path: ["confirmPassword"],
  });

const Register = () => {
  // Javascript
  const navigate = useNavigate();
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };
  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  const onSubmit = async (data) => {
    // const passwordScore = zxcvbn(data.password).score;
    // console.log(passwordScore);
    // if (passwordScore < 3) {
    //   toast.warning("Password บ่ Strong!!!!!");
    //   return;
    // }
    // console.log("ok ลูกพี่");
    // Send to Back
    try {
      const res = await axios.post("http://localhost:5002/api/register", data);

      console.log(res.data);
      // alert(res.data); // ไม่แสดง alert สำหรับการกระทำปกติ
      // Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.message;
      alert(errMsg);
      console.log(err);
    }
  };

  // const tam = Array.from(Array(5))
  // console.log(tam)
  console.log(passwordScore);
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="card p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👤</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">สมัครสมาชิก</h1>
            <p className="text-gray-600 text-lg">สร้างบัญชีใหม่เพื่อเริ่มต้น</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3">
                ชื่อ-นามสกุล *
              </label>
              <input
                {...register("fullName")}
                id="fullName"
                placeholder="กรอกชื่อ-นามสกุลของคุณ"
                className={`input-field ${errors.fullName && "border-red-500 focus:ring-red-500"}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                อีเมล *
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="กรอกอีเมลของคุณ"
                className={`input-field ${errors.email && "border-red-500 focus:ring-red-500"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                เบอร์โทรศัพท์
              </label>
              <input
                {...register("phone")}
                id="phone"
                placeholder="กรอกเบอร์โทรศัพท์ 10 ตัว"
                maxLength="10"
                className={`input-field ${errors.phone && "border-red-500 focus:ring-red-500"}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                รหัสผ่าน
              </label>
              <input
                {...register("password")}
                id="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                type="password"
                className={`input-field ${errors.password && "border-red-500 focus:ring-red-500"}`}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              
              {watch().password?.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">ความแข็งแกร่งของรหัสผ่าน:</span>
                    <span className={`text-sm font-medium ${
                      passwordScore <= 2 ? "text-red-500" : 
                      passwordScore < 4 ? "text-yellow-500" : 
                      "text-green-500"
                    }`}>
                      {passwordScore <= 2 ? "อ่อน" : passwordScore < 4 ? "ปานกลาง" : "แข็งแกร่ง"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from(Array(5).keys()).map((item, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          index < passwordScore
                            ? passwordScore <= 2
                              ? "bg-red-500"
                              : passwordScore < 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                ยืนยันรหัสผ่าน
              </label>
              <input 
                {...register("confirmPassword")} 
                id="confirmPassword"
                type="password"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className={`input-field ${errors.confirmPassword && "border-red-500 focus:ring-red-500"}`}
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button 
              type="submit"
              className="btn-primary w-full"
            >
              สมัครสมาชิก
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              มีบัญชีอยู่แล้ว?{' '}
              <a href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                เข้าสู่ระบบ
              </a>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-300 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-orange-300 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
