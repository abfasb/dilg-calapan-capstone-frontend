import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const StatisticsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  const [stats, setStats] = useState([
    { value: 0, suffix: "+", label: "Documents Processed" },
    { value: 0, suffix: "", label: "Approved Submissions" },
    { value: 0, suffix: "", label: "Rejected Submissions" },
    { value: 24, suffix: "/7", label: "Real-time Monitoring" }
  ]);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/stats`);
      const data = await res.json();
      setStats([
        { value: data.totalSubmissions, suffix: "+", label: "Documents Processed" },
        { value: data.approved, suffix: "", label: "Approved Submissions" },
        { value: data.rejected, suffix: "", label: "Rejected Submissions" },
        { value: 24, suffix: "/7", label: "Real-time Monitoring" } 
      ]);
    };

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-8 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
              }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="text-5xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">
                <Counter from={0} to={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Counter = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = from;
    const increment = (to - from) / (duration * 60);

    const timer = setInterval(() => {
      start += increment;
      setCount(Math.ceil(start));
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  return <>{count}</>;
};

export default StatisticsSection;