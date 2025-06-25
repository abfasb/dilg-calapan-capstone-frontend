import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Mayor Doy Leachon",
    role: "City Mayor of Calapan",
    text: "The eGov Nexus has revolutionized our document processing, reducing turnaround time by 70% while improving accuracy. Our citizens are happier than ever with the streamlined services.",
    avatar: "👨💼",
    rating: 5,
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50"
  },
  {
    name: "Ivan Fadriz",
    role: "City Director",
    text: "Real-time analytics have transformed our decision-making process, enabling data-driven governance like never before. The insights we get are invaluable for strategic planning.",
    avatar: "👩💻",
    rating: 5,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50"
  },
  {
    name: "Emmanuel Calica",
    role: "Operations Team",
    text: "Mobile accessibility has been a game-changer for our field operations, allowing real-time reporting from anywhere. The interface is intuitive and our team adapted quickly.",
    avatar: "👷♂️",
    rating: 5,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50"
  }
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    setIsAutoPlay(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
    setIsAutoPlay(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs with Mouse Interaction */}
          <div 
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-400/10 dark:to-purple-400/10 blur-3xl animate-pulse"
            style={{
              left: `${20 + mousePosition.x * 0.02}%`,
              top: `${10 + mousePosition.y * 0.01}%`,
              transition: 'all 0.3s ease-out'
            }}
          />
          <div 
            className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 dark:from-emerald-400/10 dark:to-teal-400/10 blur-3xl animate-pulse"
            style={{
              right: `${15 + mousePosition.x * 0.015}%`,
              bottom: `${15 + mousePosition.y * 0.015}%`,
              animationDelay: '2s',
              transition: 'all 0.3s ease-out'
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div 
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-bounce">
            <Sparkles className="w-6 h-6 text-blue-400/60 dark:text-blue-400/40" />
          </div>
          <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
            <Star className="w-5 h-5 text-purple-400/60 dark:text-purple-400/40" />
          </div>
          <div className="absolute bottom-32 left-20 animate-bounce" style={{ animationDelay: '2s' }}>
            <Quote className="w-7 h-7 text-emerald-400/60 dark:text-emerald-400/40" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 border border-blue-200/50 dark:border-blue-400/30 rounded-full text-sm font-semibold mb-8 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Client Testimonials
              </span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Trusted by
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text">
                Local Leaders
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover how government officials are{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">transforming their operations</span>{" "}
              with our innovative platform
            </p>
          </div>

          {/* Enhanced Testimonial Cards Container */}
          <div className="relative">
            <div className="flex justify-center">
              <div className="relative w-full max-w-5xl">
                {/* Main Testimonial Card */}
                <div 
                  className={`transition-all duration-700 ease-out ${
                    isAnimating ? "opacity-0 transform translate-y-8 scale-95" : "opacity-100 transform translate-y-0 scale-100"
                  }`}
                >
                  <div className="relative group">
                    {/* Card Background with Enhanced Styling */}
                    <div className={`relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-gray-900/10 dark:shadow-black/20 hover:shadow-3xl hover:shadow-gray-900/20 dark:hover:shadow-black/40 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ${testimonials[current].bgColor}`}>
                      
                      {/* Animated Border Glow */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${testimonials[current].color} rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                      
                      {/* Quote Icon with Animation */}
                      <div className="absolute -top-8 left-8 z-10">
                        <div 
                          className={`w-16 h-16 bg-gradient-to-r ${testimonials[current].color} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                        >
                          <Quote className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        {/* Enhanced Avatar and Rating Section */}
                        <div className="flex items-start gap-6 mb-8">
                          <div className="relative">
                            <div className="text-7xl lg:text-8xl hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer filter drop-shadow-lg">
                              {testimonials[current].avatar}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
                          </div>
                          
                          <div className="flex-1">
                            {/* Enhanced Star Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(testimonials[current].rating)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse hover:scale-125 transition-transform duration-300"
                                  style={{ animationDelay: `${i * 100}ms` }}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {testimonials[current].rating}.0
                              </span>
                            </div>
                            
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                              {testimonials[current].name}
                            </h3>
                            
                            <p className={`text-lg font-semibold bg-gradient-to-r ${testimonials[current].color} bg-clip-text text-transparent`}>
                              {testimonials[current].role}
                            </p>
                          </div>
                        </div>

                        {/* Enhanced Testimonial Text */}
                        <div className="relative">
                          <p className="text-xl lg:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 font-medium italic relative z-10">
                            "{testimonials[current].text}"
                          </p>
                          
                          {/* Decorative Quote Marks */}
                          <div className="absolute -top-4 -left-4 text-6xl text-gray-200 dark:text-gray-700 font-serif">"</div>
                          <div className="absolute -bottom-8 -right-4 text-6xl text-gray-200 dark:text-gray-700 font-serif">"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <button
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 group hover:scale-110 active:scale-95 transition-all duration-300"
              onClick={prevTestimonial}
              disabled={isAnimating}
            >
              <div className="relative">
                <div className="w-16 h-16 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600">
                  <ChevronLeft className="w-7 h-7 text-gray-700 dark:text-gray-200 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
            </button>

            <button
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 group hover:scale-110 active:scale-95 transition-all duration-300"
              onClick={nextTestimonial}
              disabled={isAnimating}
            >
              <div className="relative">
                <div className="w-16 h-16 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600">
                  <ChevronRight className="w-7 h-7 text-gray-700 dark:text-gray-200 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
            </button>
          </div>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center gap-4 mt-16">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`relative overflow-hidden rounded-full transition-all duration-500 hover:scale-125 active:scale-90 ${
                  index === current ? "w-16 h-4" : "w-4 h-4"
                }`}
                onClick={() => goToTestimonial(index)}
                disabled={isAnimating}
              >
                <div className={`w-full h-full rounded-full transition-all duration-500 ${
                  index === current 
                    ? `bg-gradient-to-r ${testimonials[current].color} shadow-lg` 
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`} />
                
                {index === current && isAutoPlay && (
                  <div
                    className="absolute inset-0 rounded-full bg-white/40 dark:bg-black/40 animate-pulse"
                    style={{ animationDuration: '5s' }}
                  />
                )}
                
                {index === current && (
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${testimonials[current].color} opacity-40 blur-sm animate-pulse`} />
                )}
              </button>
            ))}
          </div>

          {/* Enhanced Status Indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isAutoPlay ? 'Auto-playing • Click any control to pause' : 'Auto-play paused'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialSection;