import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FrozenAccountPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex flex-col items-center justify-center p-6 relative">
      <motion.button
        onClick={handleLogout}
        aria-label="Return to Home"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Return to Home</span>
      </motion.button>

      <div className="max-w-2xl w-full">
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4"
          >
            Account Frozen
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 max-w-md mx-auto text-lg"
          >
            Your account has been temporarily suspended. Please contact support for further assistance.
          </motion.p>
        </motion.div>

        {/* Message box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden shadow-xl p-8 md:p-10"
        >
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-6 mb-8">
            <div className="text-amber-100 text-sm">
              <p>
                For security reasons, your account has been restricted. This could be due to unusual activity or multiple failed login attempts.
              </p>
              <p className="mt-3">
                If you believe this is an error or need help resolving the issue, please contact our support team.
              </p>
            </div>
          </div>

          {/* Contact Support - Improved layout */}
          <div className="bg-gray-700/20 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-3">Contact Support</h3>
                <p className="text-gray-300 mb-5">
                  If you need assistance, feel free to reach out via email:
                </p>

                <a
                  href="mailto:dilgcalapancity@gmail.com"
                  aria-label="Send email to support"
                  className="inline-flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
                >
                  <Mail className="w-5 h-5" />
                  <span>dilgcalapancity@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrozenAccountPage;