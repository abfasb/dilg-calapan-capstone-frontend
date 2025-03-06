// TestimonialSection.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  {
    name: "Mayor Malou Flores Morillo",
    role: "City Mayor of Calapan",
    text: "The eGov Nexus has revolutionized our document processing, reducing turnaround time by 70% while improving accuracy.",
    avatar: "👨💼"
  },
  {
    name: "Ivan Fababaer",
    role: "City Director",
    text: "Real-time analytics have transformed our decision-making process, enabling data-driven governance like never before.",
    avatar: "👩💻"
  },
  {
    name: "Emmanuel Calica",
    role: "Operations Team",
    text: "Mobile accessibility has been a game-changer for our field operations, allowing real-time reporting from anywhere.",
    avatar: "👷♂️"
  }
];

const TestimonialSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          Trusted by Local Leaders
        </h2>
        
        <div className="relative h-96">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`absolute w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl ${
                index === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: index === current ? 1 : 0.9,
                opacity: index === current ? 1 : 0 
              }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="text-6xl mb-6">{testimonial.avatar}</div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">"{testimonial.text}"</p>
              <div className="text-cyan-600 dark:text-cyan-400 font-semibold">{testimonial.name}</div>
              <div className="text-gray-600 dark:text-gray-400">{testimonial.role}</div>
            </motion.div>
          ))}

          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
            onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
          >
            <FiChevronLeft size={32} />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-3 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
            onClick={() => setCurrent((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
          >
            <FiChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;