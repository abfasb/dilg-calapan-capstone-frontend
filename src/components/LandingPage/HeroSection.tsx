import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiPlay, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";

const HeroSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-12 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 z-10"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-full px-6 py-3 text-sm font-medium text-blue-700 dark:text-blue-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 }}
            >
              <FiZap className="text-blue-600 dark:text-blue-400" />
              <span>AI-Powered Governance Platform</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Revolutionizing{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Local Governance
              </span>
              {" "}with AI-Driven Solutions
            </motion.h1>

            <motion.p 
              className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Empowering Calapan LGUs with intelligent reporting, real-time decision-making tools, 
              and secure document management powered by artificial intelligence.
            </motion.p>

            {/* Feature highlights */}
            <motion.div 
              className="flex flex-wrap gap-6 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: FiTrendingUp, text: "Real-time Analytics" },
                { icon: FiShield, text: "Enterprise Security" },
                { icon: FiZap, text: "AI Automation" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <feature.icon className="text-blue-600 dark:text-blue-400 text-lg" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
                <motion.div
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.div>
              </motion.button>
              
              <motion.button 
                className="group border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-500 dark:text-cyan-500 dark:hover:bg-cyan-500/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                  <FiPlay className="text-cyan-600 dark:text-cyan-400 text-sm ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="flex items-center gap-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">Trusted by</div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">50+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">LGUs nationwide</div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="relative group"
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg flex items-center justify-center z-20"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiTrendingUp className="text-white text-2xl" />
            </motion.div>

            <motion.div 
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center z-20"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <FiShield className="text-white text-xl" />
            </motion.div>

            {/* Main dashboard container */}
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-2 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-500 border border-white/20 dark:border-gray-800/50">
              {/* Browser chrome */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-t-2xl p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-1 text-xs text-gray-500 dark:text-gray-400">
                    dilg-calapan.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-b-2xl overflow-hidden relative">
                <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative">
                  {/* Loading placeholder effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-gray-700/40 to-transparent"
                    animate={{ x: [-500, 500] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  
                  <div className="relative w-full h-full overflow-hidden rounded-b-2xl">
                    <img 
                      src="https://i.ibb.co/m5fQd0FN/react-dashboard.jpg" 
                      className="w-full h-full object-contain bg-white dark:bg-gray-800 hover:scale-105 transition-transform duration-700" 
                      alt="DILG AI Dashboard Interface" 
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;