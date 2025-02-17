import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEnvelope, FaCheckCircle, FaRocket } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

interface ForgotPasswordForm {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/account/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      if (response.ok) {
        setEmailSent(true);
        setCountdown(60);
      } else {
        alert(result.message || "Error sending reset email");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20" />
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 50 },
              move: { enable: true, speed: 1 },
              size: { value: 1 },
              opacity: { value: 0.5 },
              links: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.2,
              },
            },
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 backdrop-blur-lg border border-gray-700/30"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <FaRocket className="text-4xl text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Password Recovery
          </h1>
          <p className="text-gray-400">Enter your email to launch password reset</p>
        </div>

        <AnimatePresence mode="wait">
          {emailSent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-6"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                <FaCheckCircle className="text-6xl text-cyan-400 relative z-10 mx-auto mb-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Launch Successful!</h2>
              <p className="text-gray-400 mb-4">
                We've sent a password reset rocket to<br />
                <span className="text-cyan-400 font-medium">{document.querySelector<HTMLInputElement>("input[name='email']")?.value}</span>
              </p>
              
              <div className="mt-6">
                {countdown > 0 ? (
                  <div className="text-gray-400">
                    Resend available in{" "}
                    <span className="font-mono text-cyan-400">{countdown}s</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubmit(onSubmit)()}
                    className="px-6 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 hover:bg-cyan-500/20 transition-all"
                  >
                    Re-send Email
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full px-4 py-3 pl-11 rounded-lg bg-gray-800/50 border ${
                      errors.email ? "border-red-400/50" : "border-gray-700/50"
                    } focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all`}
                    placeholder="your.email@example.com"
                  />
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-500 text-lg" />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-gray-100 hover:shadow-lg hover:shadow-cyan-500/20 transition-all relative"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <a
            href="/account/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
          >
            Return to Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}