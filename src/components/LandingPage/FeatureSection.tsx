import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Reporting",
    description: "Automated report generation with natural language processing and predictive analytics"
  },
  {
    icon: "⚡",
    title: "Real-Time Analytics",
    description: "Instant insights with interactive dashboards and data visualization tools"
  },
  {
    icon: "🔒",
    title: "Secure Document Management",
    description: "Blockchain-based storage with role-based access control and version tracking"
  },
  {
    icon: "📈",
    title: "Performance Metrics",
    description: "KPIs tracking and comparative analysis across departments"
  },
  {
    icon: "🌐",
    title: "Multi-Agency Integration",
    description: "Seamless API integration with existing government systems"
  },
  {
    icon: "📱",
    title: "Mobile Ready",
    description: "Cross-platform compatibility with offline capabilities"
  }
];

const FeaturesSection : React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div 
          className="text-center mb-16"
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          <h2 className="text-4xl text-black dark:text-white font-bold mb-4">Transformative Features</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Cutting-edge solutions designed specifically for local government digital transformation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="shadow-lg  dark:bg-gray-800/50 hover:bg-white-800/80 p-8 rounded-2xl dark:border dark:border-gray-700/50 transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-6 text-5xl transform group-hover:rotate-12 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl text-black dark:text-white font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;