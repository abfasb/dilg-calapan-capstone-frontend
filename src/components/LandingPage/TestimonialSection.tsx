import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface TestimonialSectionProps {
  theme?: 'light' | 'dark';
}

const testimonials = [
  {
    name: "Mayor Doy Leachon",
    role: "City Mayor of Calapan",
    text: "The eGov Nexus has revolutionized our document processing, reducing turnaround time by 70% while improving accuracy. Our citizens are happier than ever with the streamlined services.",
    avatar: "👨💼",
    rating: 5,
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Ivan Fadriz",
    role: "City Director",
    text: "Real-time analytics have transformed our decision-making process, enabling data-driven governance like never before. The insights we get are invaluable for strategic planning.",
    avatar: "👩💻",
    rating: 5,
    color: "from-emerald-500 to-teal-600"
  },
  {
    name: "Emmanuel Calica",
    role: "Operations Team",
    text: "Mobile accessibility has been a game-changer for our field operations, allowing real-time reporting from anywhere. The interface is intuitive and our team adapted quickly.",
    avatar: "👷♂️",
    rating: 5,
    color: "from-orange-500 to-red-600"
  }
];

const TestimonialSection = ({ theme = 'dark' }: TestimonialSectionProps) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

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

  const goToTestimonial = (index: number) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section className={cn(
      "relative py-24 overflow-hidden transition-all duration-500",
      isDark 
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    )}>
      {/* Animated Background Pattern */}
      <div className={cn("absolute inset-0", isDark ? "opacity-20" : "opacity-10")}>
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'ffffff' : '000000'}' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Floating Orbs */}
      <div className={cn(
        "absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl animate-pulse",
        isDark 
          ? "bg-gradient-to-r from-cyan-400/20 to-blue-600/20" 
          : "bg-gradient-to-r from-blue-400/30 to-purple-400/30"
      )} />
      <div 
        className={cn(
          "absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse",
          isDark 
            ? "bg-gradient-to-r from-purple-400/20 to-pink-600/20" 
            : "bg-gradient-to-r from-purple-400/20 to-pink-400/20"
        )}
        style={{ animationDelay: '2s' }} 
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium mb-6 hover:scale-105 transition-transform duration-300",
            isDark 
              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
              : "bg-blue-50 border-blue-200 text-blue-600"
          )}>
            <Star className="w-4 h-4" />
            Testimonials
          </div>
          <h2 className={cn(
            "text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent",
            isDark 
              ? "bg-gradient-to-r from-white via-cyan-200 to-blue-400" 
              : "bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600"
          )}>
            Trusted by Local Leaders
          </h2>
          <p className={cn(
            "text-xl max-w-2xl mx-auto",
            isDark ? "text-slate-300" : "text-gray-600"
          )}>
            Discover how government officials are transforming their operations with our platform
          </p>
        </div>

        {/* Testimonial Cards Container */}
        <div className="relative">
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl h-80">
              {/* Testimonial Card */}
              <div 
                className={cn(
                  "absolute inset-0 transition-all duration-600 ease-out",
                  isAnimating ? "opacity-0 transform translate-x-8" : "opacity-100 transform translate-x-0"
                )}
              >
                <div className="relative h-full">
                  <div className={cn(
                    "relative h-full backdrop-blur-xl border rounded-3xl p-8 lg:p-12 shadow-2xl hover:transform hover:-translate-y-2 hover:scale-105 transition-all duration-300",
                    isDark 
                      ? "bg-white/10 border-white/20" 
                      : "bg-white/80 border-gray-200/50 shadow-gray-900/10"
                  )}>
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${testimonials[current].color} opacity-20 blur-xl`} />
                    
                    {/* Quote Icon */}
                    <div className="absolute -top-6 left-8">
                      <div className={`w-12 h-12 bg-gradient-to-r ${testimonials[current].color} rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-2xl font-bold">"</span>
                      </div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                      {/* Avatar and Rating */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-6xl hover:scale-110 hover:rotate-12 transition-transform duration-300 cursor-pointer">
                          {testimonials[current].avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonials[current].rating)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                              />
                            ))}
                          </div>
                          <h3 className={cn(
                            "text-xl font-bold",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {testimonials[current].name}
                          </h3>
                          <p className={cn(
                            "font-medium",
                            isDark ? "text-cyan-300" : "text-blue-600"
                          )}>
                            {testimonials[current].role}
                          </p>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <div className="flex-1">
                        <p className={cn(
                          "text-lg lg:text-xl leading-relaxed italic",
                          isDark ? "text-slate-200" : "text-gray-700"
                        )}>
                          "{testimonials[current].text}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 group hover:scale-110 active:scale-95 transition-transform duration-200"
            onClick={prevTestimonial}
            disabled={isAnimating}
          >
            <div className={cn(
              "w-14 h-14 backdrop-blur-xl border rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
              isDark 
                ? "bg-white/10 border-white/20 group-hover:bg-white/20" 
                : "bg-white/80 border-gray-200/50 group-hover:bg-white group-hover:shadow-xl"
            )}>
              <ChevronLeft className={cn(
                "w-6 h-6 transition-colors duration-300",
                isDark 
                  ? "text-white group-hover:text-cyan-300" 
                  : "text-gray-700 group-hover:text-blue-600"
              )} />
            </div>
          </button>

          <button
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 group hover:scale-110 active:scale-95 transition-transform duration-200"
            onClick={nextTestimonial}
            disabled={isAnimating}
          >
            <div className={cn(
              "w-14 h-14 backdrop-blur-xl border rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
              isDark 
                ? "bg-white/10 border-white/20 group-hover:bg-white/20" 
                : "bg-white/80 border-gray-200/50 group-hover:bg-white group-hover:shadow-xl"
            )}>
              <ChevronRight className={cn(
                "w-6 h-6 transition-colors duration-300",
                isDark 
                  ? "text-white group-hover:text-cyan-300" 
                  : "text-gray-700 group-hover:text-blue-600"
              )} />
            </div>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "relative overflow-hidden rounded-full transition-all duration-300 hover:scale-120 active:scale-90",
                index === current ? "w-12 h-3" : "w-3 h-3"
              )}
              onClick={() => goToTestimonial(index)}
              disabled={isAnimating}
            >
              <div className={cn(
                "w-full h-full rounded-full transition-all duration-300",
                index === current 
                  ? `bg-gradient-to-r ${testimonials[current].color}` 
                  : isDark 
                    ? "bg-white/30 hover:bg-white/50" 
                    : "bg-gray-300 hover:bg-gray-400"
              )} />
              {index === current && isAutoPlay && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    isDark ? "bg-white/30" : "bg-gray-600/30"
                  )}
                  style={{ animationDuration: '5s' }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className={cn(
            "text-sm",
            isDark ? "text-slate-400" : "text-gray-500"
          )}>
            {isAutoPlay ? 'Auto-playing • Click any control to pause' : 'Auto-play paused'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
