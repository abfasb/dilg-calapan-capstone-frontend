// HeroSection.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HeroSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 bg-white dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-indigo-100/50 dark:from-blue-900/50 dark:to-indigo-900/50" />
      
      <motion.div 
        className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Revolutionizing Local Governance with{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI-Driven Solutions
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Empowering Calapan LGUs with intelligent reporting, real-time decision-making tools, 
              and secure document management powered by artificial intelligence.
            </motion.p>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105">
                Get Started
              </button>
              <button className="border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-500 dark:text-cyan-500 dark:hover:bg-cyan-500/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105">
                Watch Demo
              </button>
            </motion.div>
          </div>

          <motion.div 
            className="relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            
            <div className="relative bg-white dark:bg-gray-900 h-90 rounded-2xl p-6 shadow-2xl transform group-hover:-translate-y-2 transition-transform">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="h-85 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                  <div className="text-center h-80 space-y-4">
                    <img src="https://i.ibb.co/QFg9CwMb/react-dashboard.jpg" className="h-full w-full" alt="DILG Dashboard" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;