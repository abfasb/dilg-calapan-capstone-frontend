import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaExclamationCircle, FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { loginUser } from '../api/registrationApi';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Checkbox } from './ui/checkbox';

interface IFormInput {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<IFormInput>({
    mode: 'onChange'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      const response = await loginUser(data.email, data.password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('adminEmail', response.user.email);
      localStorage.setItem('name', response.user.name);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("firstName", response.user.firstName);
      localStorage.setItem("lastName", response.user.lastName);
      localStorage.setItem("position", response.user.position);
      localStorage.setItem("barangay", response.user.barangay);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("phoneNumber", response.user.phoneNumber);
      
      toast.success('Login Successful!', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
  
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        window.location.href = `/dashboard/${response.user.id}`;
      }
  
    } catch (err) {
      const errorMessage = 'Something is wrong with your username or password.';
      setError(errorMessage);
    }
  };

  return ( 
    <>
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 animate-gradient-x">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative bg-white/5 dark:bg-gray-900/50 p-8 rounded-2xl shadow-2xl w-full max-w-[440px]
                     backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-1 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-2"
            >
              <div className="h-14 w-14 mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <span className="text-2xl font-bold text-white">⚡</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-400 mt-2">Continue your journey with us</p>
            </motion.div>
          </div>

          {/* Google Sign In - Enhanced Single Button */}
          <div className="mb-8">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 
                         flex items-center justify-center gap-3 transition-all duration-200
                         hover:shadow-lg hover:shadow-cyan-500/10 group"
              onClick={() => window.location.href=`${import.meta.env.VITE_API_URL}/auth/google`}sense
            >
              <FcGoogle className="w-6 h-6" />
              <span className="text-white font-medium group-hover:text-cyan-100 transition-colors">
                Continue with Google
              </span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/5 text-gray-400 text-xs font-medium rounded-full backdrop-blur-xl border border-white/10">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field with Autocomplete Fix */}
            <div>
              <div className="relative">
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  id="email"
                  placeholder=" "
                  autoComplete="email"
                  className={`peer w-full px-4 py-4 rounded-xl bg-white/5 border ${
                    errors.email ? 'border-red-400/50' : 'border-white/10'
                  } focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all
                  duration-200 text-white placeholder-transparent
                  autofill:bg-white/5 autofill:text-white
                  [&:-webkit-autofill]:bg-white/5 [&:-webkit-autofill]:text-white
                  [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]
                  [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]
                  [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]
                  [&:-webkit-autofill]:[-webkit-text-fill-color:white]`}
                  style={{
                    WebkitBoxShadow: 'inset 0 0 0 1000px rgba(255,255,255,0.05)',
                    WebkitTextFillColor: 'white'
                  }}
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-4 -top-2.5 px-2 text-xs text-gray-400 bg-gradient-to-b from-slate-900/80 to-slate-800/80 rounded transition-all
                  peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs
                  peer-focus:text-cyan-400"
                >
                  Email Address
                </label>
                {errors.email && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-3 top-4 text-red-400"
                  >
                    <FaExclamationCircle className="w-5 h-5" />
                  </motion.div>
                )}
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-2"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder=" "
                  autoComplete="current-password"
                  className={`peer w-full px-4 py-4 rounded-xl bg-white/5 border ${
                    errors.password ? 'border-red-400/50' : 'border-white/10'
                  } focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all
                  duration-200 text-white placeholder-transparent pr-14`}
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-4 -top-2.5 px-2 text-xs text-gray-400 bg-gradient-to-b from-slate-900/80 to-slate-800/80 rounded transition-all
                  peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs
                  peer-focus:text-cyan-400"
                >
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-2"
                >
                  <FaExclamationCircle className="w-4 h-4" />
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="text-red-400 text-sm flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-400/20"
                >
                  <FaExclamationCircle className="flex-shrink-0 w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox id="remember" className="border-cyan-400/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => window.location.href='/account/forgot-password'}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Forgot password?
              </motion.button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                        text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg
                        hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2 text-sm relative overflow-hidden
                        focus:ring-4 focus:ring-cyan-500/30"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              New to our platform?{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => window.location.href='/account/register'}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Create an account
              </motion.button>
            </p>
          </div>

          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
        </motion.div>
      </div>
    </>
  );
};

export default Login;