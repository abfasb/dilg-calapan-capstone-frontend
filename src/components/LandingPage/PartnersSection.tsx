import React, { useState, useEffect } from 'react';
import { Globe, Shield, Users, Zap, Heart, Building } from 'lucide-react';

const PartnersSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredPartner, setHoveredPartner] = useState(null);

  const partners = [
    { 
      name: 'NAPOLOCOM', 
      icon: Shield,
      fullName: 'National Police Commission',
      description: 'Police oversight and governance',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      name: 'DICT', 
      icon: Globe,
      fullName: 'Department of Information and Communications Technology',
      description: 'Digital transformation initiatives',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'DSWD', 
      icon: Heart,
      fullName: 'Department of Social Welfare and Development',
      description: 'Social services and welfare programs',
      color: 'from-red-500 to-pink-600'
    },
    { 
      name: 'PNP', 
      icon: Shield,
      fullName: 'Philippine National Police',
      description: 'Law enforcement and public safety',
      color: 'from-purple-500 to-violet-600'
    },
    { 
      name: 'BFP', 
      icon: Zap,
      fullName: 'Bureau of Fire Protection',
      description: 'Fire prevention and emergency response',
      color: 'from-orange-500 to-red-600'
    },
    { 
      name: 'LGA', 
      icon: Building,
      fullName: 'Local Government Academy',
      description: 'Capacity building and training',
      color: 'from-cyan-500 to-blue-600'
    },
  ];

  const stats = [
    { number: '150+', label: 'Government Agencies' },
    { number: '2.5M+', label: 'Citizens Served' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'System Uptime' }
  ];

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Dark mode toggle */}
      <div className="fixed top-6 right-6 z-50">
        
      </div>

      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-400/20 dark:to-cyan-400/20 px-6 py-3 rounded-full mb-8 border border-blue-200/50 dark:border-blue-400/30">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Government Partners</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
                Trusted by Leading
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Government Agencies
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering public service excellence through strategic partnerships and innovative digital solutions
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {partners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredPartner(index)}
                  onMouseLeave={() => setHoveredPartner(null)}
                >
                  <div className="relative h-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2">
                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r ${partner.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <div className="h-full w-full rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`
                        inline-flex p-4 rounded-2xl mb-6 transition-all duration-300
                        bg-gradient-to-r ${partner.color}
                        ${hoveredPartner === index ? 'scale-110 rotate-6' : ''}
                      `}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Partner Name */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {partner.name}
                      </h3>

                      {/* Full Name */}
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {partner.fullName}
                      </h4>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {partner.description}
                      </p>

                      {/* Partnership Status */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Active Partnership</span>
                      </div>

                      {/* Hover Effect */}
                      <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                        <span className="text-sm font-semibold mr-2">Learn More</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Floating particles effect */}
                    {hoveredPartner === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 bg-gradient-to-r ${partner.color} rounded-full animate-ping`}
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
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="inline-flex items-center gap-8 p-8 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm rounded-3xl border border-white/60 dark:border-gray-700/60 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">ISO 27001 Certified</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Information Security</div>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Government Grade</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Security Standards</div>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">24/7 Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Dedicated Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersSection;