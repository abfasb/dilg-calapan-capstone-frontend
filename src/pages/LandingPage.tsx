import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeatureSection";
import StatisticsSection from "../components/LandingPage/StatisticSection";
import TestimonialSection from "../components/LandingPage/TestimonialSection";
import CTASection from "../components/LandingPage/CTASection";
import FaqSection from "../components/LandingPage/FaqSection";
import PartnersSection from "../components/LandingPage/PartnersSection";
import ContactSection from "../components/LandingPage/ContactSection";
import Footer from "../components/LandingPage/Footer";

const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full mx-auto"
      >
        <section id="hero" className="min-h-screen w-full">
          <HeroSection />
        </section>
        
        <section id="features" className="py-20">
          <FeaturesSection />
        </section>
        
        <section id="statistics" className="py-20">
          <StatisticsSection />
        </section>
        
        <section id="testimonials" className="py-20">
          <TestimonialSection />
        </section>
        
        <section id="cta" className="py-20">
          <CTASection />
        </section>
        
        <section id="faq" className="py-20">
          <FaqSection />
        </section>
        
        <section id="partners" className="py-20">
          <PartnersSection />
        </section>
        
        <section id="contact" className="py-20">
          <ContactSection />
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;