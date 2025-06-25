import React, { useState } from 'react';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    title: "AI Governance Core",
    description: "Neural network-powered decision making with real-time analytics and predictive governance models",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Smart Analytics",
    description: "Predictive insights with machine learning models and advanced data visualization dashboards",
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Quantum Encryption",
    description: "Blockchain-secured document management with quantum-resistant cryptographic protocols",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "API Ecosystem",
    description: "Seamless integration with government systems through RESTful APIs and microservices architecture",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: "Omnichannel",
    description: "Cross-platform mobile governance suite with progressive web app capabilities",
    color: "from-indigo-400 to-purple-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    title: "Smart Metrics",
    description: "Real-time KPI tracking with AI recommendations and automated performance optimization",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
  }
];

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
     
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 dark:from-cyan-600/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 dark:from-emerald-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
          {/* Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-400/20 dark:to-blue-400/20 px-6 py-3 rounded-full mb-8 border border-cyan-200/30 dark:border-cyan-400/30">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-lg">Digital Governance Suite</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-cyan-600 dark:from-gray-100 dark:via-gray-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Next-Gen
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Governance
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Powered by artificial intelligence and blockchain technology for 
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold"> transformative </span>
              local government management
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card */}
                <div className={`
                  relative h-full p-8 rounded-3xl transition-all duration-500 cursor-pointer
                  ${feature.bgColor}
                  backdrop-blur-sm border border-white/50 dark:border-gray-700/30
                  shadow-xl hover:shadow-2xl
                  transform hover:scale-105 hover:-translate-y-2
                  ${hoveredIndex === index ? 'shadow-2xl scale-105 -translate-y-2' : ''}
                `}>
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className={`h-full w-full rounded-3xl ${feature.bgColor}`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`
                      inline-flex p-4 rounded-2xl mb-6 transition-all duration-300
                      bg-gradient-to-r ${feature.color}
                      ${hoveredIndex === index ? 'scale-110 rotate-6' : ''}
                    `}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-cyan-600 dark:group-hover:from-gray-100 dark:group-hover:to-cyan-400 transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-6 flex items-center text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                      <span className="text-sm font-semibold mr-2">Explore</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Floating particles effect */}
                  {hoveredIndex === index && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-1 h-1 bg-gradient-to-r ${feature.color} rounded-full animate-ping`}
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '2s'
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <button className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Explore All Features</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;