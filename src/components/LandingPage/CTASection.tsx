import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const CTASection= () => {
  return (
    <section id="cta" className="py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your LGU?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join 50+ local government units already revolutionizing their operations with AI-powered governance solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  Start Now <FiArrowRight className="text-lg" />
                </motion.button>
                <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Schedule Appointment
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['Real-time Analytics', 'AI Reports', 'Secure Storage', '24/7 Support'].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                  whileHover={{ y: -5 }}
                >
                  <FiCheckCircle className="text-2xl text-white mb-2" />
                  <p className="text-white font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;