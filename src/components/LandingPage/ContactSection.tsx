import { motion } from 'framer-motion';
import React from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[40px] p-12 shadow-2xl border border-black/10 dark:border-white/10 transition-colors"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-8 text-gray-900 dark:text-white"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Connect with Innovation
              </h2>
              <p className="text-xl text-gray-700 dark:opacity-80 dark:text-white">
                Revolutionize your LGU operations with our next-gen eGov solutions.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-cyan-400/10 transition-colors">
                    <FiMapPin className="text-2xl text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-2">Calapan City Office</p>
                    <p className="text-sm text-gray-700 dark:opacity-80 dark:text-white">
                      1st Floor, Local Government Center<br />
                      New City Hall Complex, M. Roxas Drive<br />
                      Calapan, 5200 Oriental Mindoro
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-cyan-400/10 transition-colors">
                    <FiMail className="text-2xl text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-2">Digital Support</p>
                    <p className="text-sm text-gray-700 dark:opacity-80 dark:text-white">dilgcalapancity@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-cyan-400/10 transition-colors">
                    <FiPhone className="text-2xl text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-2">24/7 Assistance</p>
                    <p className="text-sm text-gray-700 dark:opacity-80 dark:text-white">+63 905 5812 027</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-lg rounded-[32px] p-8 border border-black/10 dark:border-white/10 transition-colors"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-3">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-4 bg-white dark:bg-gray-900/50 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-3">Email</label>
                  <input
                    type="email"
                    className="w-full p-4 bg-white dark:bg-gray-900/50 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="juanlgu@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-3">Message</label>
                  <textarea
                    rows={5}
                    className="w-full p-4 bg-white dark:bg-gray-900/50 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="How can we transform your LGU operations?"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 rounded-xl font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
                >
                  Send Quantum Message
                </motion.button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
