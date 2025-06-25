import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiStar, FiUsers } from "react-icons/fi";

const CTASection = () => {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200 dark:bg-cyan-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        {/* Stats banner */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <FiUsers className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">50+ LGUs</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <FiStar className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">99.9% Uptime</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-800 dark:via-blue-900 dark:to-cyan-800 rounded-3xl p-1 shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-75 blur-sm animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-800 dark:via-blue-900 dark:to-cyan-800 rounded-3xl p-12 lg:p-16">
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 bg-cyan-300/20 dark:bg-cyan-400/10 rounded-full blur-xl"></div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
              <div className="text-white space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Ready to Transform Your{" "}
                    <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                      LGU?
                    </span>
                  </h2>
                  <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                    Join 50+ local government units already revolutionizing their operations with 
                    AI-powered governance solutions. Experience the future of public administration.
                  </p>
                </motion.div>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button 
                    className="group bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial
                    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button 
                    className="group border-2 border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 hover:border-white/60 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="group-hover:text-white transition-colors">Schedule Demo</span>
                  </motion.button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div 
                  className="flex items-center gap-4 pt-6 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-sm opacity-75">Trusted by:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">LG</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">DI</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">PH</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: FiCheckCircle, title: 'Real-time Analytics', desc: 'Live insights & reports' },
                  { icon: FiCheckCircle, title: 'AI-Powered Reports', desc: 'Intelligent automation' },
                  { icon: FiCheckCircle, title: 'Secure Cloud Storage', desc: 'Enterprise-grade security' },
                  { icon: FiCheckCircle, title: '24/7 Expert Support', desc: 'Always here to help' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="group bg-white/10 dark:bg-white/5 p-6 rounded-2xl backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40"
                    whileHover={{ y: -8, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <feature.icon className="text-3xl text-white mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-semibold mb-1 text-lg">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom guarantee */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            🔒 30-day money-back guarantee • No setup fees • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;