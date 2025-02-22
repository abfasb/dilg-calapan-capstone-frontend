import { motion } from 'framer-motion';
import React from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const ContactSection : React.FC= () => {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              className="text-white space-y-8"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
            >
              <h2 className="text-4xl font-bold">Get in Touch</h2>
              <p className="text-lg opacity-90">
                Have questions about implementing eGov Nexus in your LGU? Our team is ready to help.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <FiMapPin className="text-2xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Calapan City Office</p>
                    <p className="opacity-90">1st Floor, Local Government Center New City Hall Complex, M. Roxas Drive Barangay, Calapan, 5200 Oriental Mindoro</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FiMail className="text-2xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="opacity-90">dilgcalapancity@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FiPhone className="text-2xl flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <p className="opacity-90">+63 905 5812 027</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form 
              className="bg-white rounded-2xl p-8 shadow-xl"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder='juanlgu@gmail.com'
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="How can we help your LGU/Barangay?"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-cyan-500 text-white py-4 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                >
                  Send Message
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;