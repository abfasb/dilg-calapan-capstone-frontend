import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';
import React from 'react';

const PartnersSection : React.FC= () => {
  const partners = [
    { name: 'NAPOLOCOM', logo: <FiGlobe /> },
    { name: 'DICT', logo: <FiGlobe /> },
    { name: 'DSWD', logo: <FiGlobe /> },
    { name: 'PNP', logo: <FiGlobe /> },
    { name: 'BFP', logo: <FiGlobe /> },
    { name: 'LGA', logo: <FiGlobe /> },
  ];

  return (
    <section id="partners" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Trusted by Government Agencies
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-3xl">{partner.logo}</span>
                <span className="font-medium">{partner.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;