import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Must contain uppercase, number, and special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>(); 
  console.log(token);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!token) return;
    
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/account/reset-password/${token}`);
        console.log(response.data.email);
        console.log('hello world');
        if (response.data.email) {
          setEmail(response.data.email);
        } else {
          setMessage("Invalid or expired token");
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Invalid or expired token");
      }
    };
    
  
    fetchUserEmail();
  }, [token]);
  

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/account/reset-password/${token}`,
        { password: data.newPassword }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/account/login"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 bg-black"
    style={{  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://i.ibb.co/Xrcwr3fm/474975489-624902033229226-8762022534966171083-n.jpg')" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-500">Create a new secure password</p>
          {email && <p className="text-gray-600 font-semibold mt-2">{email}</p>}
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                {...register("newPassword")}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-600"
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-600"
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
}
