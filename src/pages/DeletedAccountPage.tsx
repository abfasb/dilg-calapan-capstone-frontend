import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeletedAccountPage = () => {

    const navigate = useNavigate();
    
  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("barangay");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("position");
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center">
                <Trash2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Account Terminated
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 max-w-md mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your account has been permanently deleted
          </motion.p>
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-8 md:p-10">
            {/* Warning section */}
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-200 mb-2">Administrative Action</h3>
                  <div className="mt-2 text-red-100 text-sm">
                    <p>
                      Your account has been permanently deleted by the system administrator due to 
                      violations of our terms of service.
                    </p>
                    <p className="mt-3">
                      This decision is final and cannot be appealed. All associated data has been 
                      permanently removed from our systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700/20 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-white">Reason for Termination</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Multiple violations of our community guidelines including abusive behavior and 
                  unauthorized access attempts.
                </p>
              </div>
              
              <div className="bg-gray-700/20 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-white">Policy Reference</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Section 8.2 - Account Termination for Violations. Our moderation team has reviewed 
                  this action.
                </p>
              </div>
            </div>

            {/* Contact section */}
            <div className="bg-gray-700/20 rounded-xl p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-rose-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Administration</h3>
                  <p className="text-gray-300 mb-4">
                    For inquiries regarding this termination, you may contact the system administrator:
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <a 
                      href="mailto:dilgcalapancity@gmail.com" 
                      className="inline-flex items-center px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      dilgcalapancity@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 px-8 py-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} DILG Calapan City
              </p>
              <button
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Return to Home
              </button>
            </div>
          </div>
        </motion.div>
        
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-red-500/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() > 0.5 ? 20 : -20, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeletedAccountPage;