import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

interface FAQ {
  question: string;
  answer: string;
}

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultFAQs = [
    {
      question: "How secure is our document management system?",
      answer: "We use military-grade encryption and blockchain technology to ensure maximum security for all government documents."
    },
    {
      question: "Can we integrate with existing government systems?",
      answer: "Yes, our platform offers seamless API integration with all major government platforms and legacy systems."
    },
    {
      question: "What training is provided for LGU staff?",
      answer: "We provide comprehensive training programs and 24/7 support to ensure smooth adoption across all departments."
    },
    {
      question: "How does the AI reporting work?",
      answer: "Our AI analyzes historical data and current metrics to generate predictive reports and actionable insights."
    }
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faqs`);
        const data: FAQ[] = await response.json();
        const mergedFAQs = [...data, ...defaultFAQs.slice(data.length)];
        setFaqs(mergedFAQs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setFaqs(defaultFAQs); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (isLoading) return null;

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4 text-cyan-600 dark:text-cyan-400">
            <FiHelpCircle className="text-3xl" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">FAQs</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Common questions about implementing AI-powered governance solutions for your LGU
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md dark:shadow-none"
            >
              <button
                className="flex justify-between items-center w-full p-6 bg-cyan-100 dark:bg-gray-900 hover:bg-cyan-200 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                >
                  <FiChevronDown className="text-xl text-gray-600 dark:text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 pt-2 text-gray-800 dark:text-gray-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
