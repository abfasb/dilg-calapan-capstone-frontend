
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../NavBar';

interface Blog {
  _id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<{[key: number]: boolean}>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Simplified theme management - use only the theme state
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    // Initialize theme
    document.documentElement.classList.add(theme);
    
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/get-blogs/${id}`);
        setBlog(data);
      } catch (err) {
        setError('Failed to load blog. Please try again later.');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();

    // Scroll progress and effects
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(scrollPercent);
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [id, theme]);

  // Advanced grid layout system with magazine-style design
  const getOptimizedGridLayout = (index: number, total: number) => {
    const layouts: { [key: number]: string[] } = {
      1: ['col-span-12 row-span-2 aspect-[21/10] lg:aspect-[21/9]'],
      
      2: [
        'col-span-12 lg:col-span-8 row-span-2 aspect-[16/10]',
        'col-span-12 lg:col-span-4 aspect-[4/5]'
      ],
      
      3: [
        'col-span-12 lg:col-span-7 row-span-2 aspect-[16/10]',
        'col-span-6 lg:col-span-5 aspect-[4/3]',
        'col-span-6 lg:col-span-5 aspect-[4/3]'
      ],
      
      4: [
        'col-span-12 lg:col-span-6 row-span-2 aspect-[4/5]',
        'col-span-12 lg:col-span-6 aspect-[16/10]',
        'col-span-6 lg:col-span-3 aspect-square',
        'col-span-6 lg:col-span-3 aspect-square'
      ],
      
      5: [
        'col-span-12 lg:col-span-8 row-span-2 aspect-[16/9]',
        'col-span-6 lg:col-span-2 aspect-[3/4]',
        'col-span-6 lg:col-span-2 aspect-[3/4]',
        'col-span-6 lg:col-span-6 aspect-[16/9]',
        'col-span-6 lg:col-span-6 aspect-[16/9]'
      ],
      
      6: [
        'col-span-12 lg:col-span-8 row-span-2 aspect-[16/10]',
        'col-span-6 lg:col-span-2 aspect-square',
        'col-span-6 lg:col-span-2 aspect-square',
        'col-span-4 lg:col-span-2 aspect-[4/3]',
        'col-span-4 lg:col-span-2 aspect-[4/3]',
        'col-span-4 lg:col-span-2 aspect-[4/3]'
      ]
    };

    // For more than 6 images, use a dynamic mosaic pattern
    if (total > 6) {
      const patterns = [
        'col-span-12 lg:col-span-6 row-span-2 aspect-[16/9]',
        'col-span-6 lg:col-span-3 aspect-square',
        'col-span-6 lg:col-span-3 aspect-square',
        'col-span-6 lg:col-span-4 aspect-[4/3]',
        'col-span-6 lg:col-span-2 aspect-[3/4]'
      ];
      return patterns[index % patterns.length];
    }

    return layouts[total]?.[index] || 'col-span-6 lg:col-span-3 aspect-square';
  };

  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: true }));
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-12">
      {/* Hero skeleton */}
      <div className={`relative h-[50vh] lg:h-[60vh] rounded-3xl overflow-hidden ${
        isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 space-y-4">
          <div className={`h-4 w-32 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
          <div className={`h-12 w-3/4 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
        </div>
      </div>
      
      {/* Gallery skeleton */}
      <div className="grid grid-cols-12 gap-6 auto-rows-max">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'} ${
              i === 0 ? 'col-span-12 lg:col-span-8 h-80' : 'col-span-6 lg:col-span-2 h-48'
            }`}
          />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-6 max-w-4xl">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'} ${
            i === 3 || i === 6 ? 'w-4/5' : 'w-full'
          }`} />
        ))}
      </div>
    </div>
  );

  if (loading) return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {renderLoadingSkeleton()}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className={`max-w-md w-full text-center p-10 rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-slate-900/50 border-slate-700/50 shadow-2xl shadow-slate-950/50' 
                : 'bg-white/70 border-white/20 shadow-2xl shadow-gray-900/10'
            }`}>
              <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30' 
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'
              }`}>
                <svg className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Something went wrong
              </h3>
              <p className={`mb-8 text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className={`w-full px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!blog) return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className={`text-center ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Blog not found
              </h2>
              <p className="text-lg">The blog post you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      
      <div className={`fixed top-0 left-0 h-1 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`} 
      style={{ width: `${readingProgress}%` }} />

      {/* Floating Action Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 z-40 ${
            isDarkMode 
              ? 'bg-slate-900/80 border-slate-700/50 text-white hover:bg-slate-800/90' 
              : 'bg-white/80 border-white/20 text-gray-700 hover:bg-white/90'
          }`}
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className={`relative rounded-3xl lg:rounded-[2rem] overflow-hidden mb-16 ${
            blog.images.length > 0 ? 'h-[50vh] lg:h-[70vh]' : 'h-[40vh]'
          } ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' 
              : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
          }`}>
            {/* Hero Background */}
            {blog.images.length > 0 && (
              <>
                <img
                  src={blog.images[0]}
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </>
            )}
            
            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <div className="max-w-4xl space-y-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl border ${
                    isDarkMode || blog.images.length > 0
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-black/10 border-black/20 text-gray-900'
                  }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(blog.date), 'MMMM dd, yyyy')}
                  </span>
                  
                  {blog.images.length > 0 && (
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl border ${
                      isDarkMode || blog.images.length > 0
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-black/10 border-black/20 text-gray-900'
                    }`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {blog.images.length} {blog.images.length === 1 ? 'Image' : 'Images'}
                    </span>
                  )}
                </div>
                
                <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] ${
                  isDarkMode || blog.images.length > 0 ? 'text-white' : 'text-gray-900'
                } drop-shadow-2xl`}>
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>

          <article className="space-y-20">
            {/* Enhanced Gallery Section */}
            {blog.images.length > 0 && (
              <section className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className={`text-3xl lg:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Visual Story
                    </h2>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Explore {blog.images.length} carefully curated {blog.images.length === 1 ? 'image' : 'images'}
                    </p>
                  </div>
                  
                  <div className={`hidden sm:flex items-center space-x-2 text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    <span>Click to expand</span>
                  </div>
                </div>
                
                {/* Premium Magazine-Style Grid */}
                <div className="grid grid-cols-12 gap-4 lg:gap-8 auto-rows-max">
                  {blog.images.map((image, index) => {
                    const layoutClass = getOptimizedGridLayout(index, blog.images.length);
                    const isLoaded = imageLoadStates[index];
                    
                    return (
                      <div
                        key={index}
                        className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 ${layoutClass} ${
                          isDarkMode 
                            ? 'hover:shadow-2xl hover:shadow-black/50' 
                            : 'hover:shadow-2xl hover:shadow-black/20'
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        {/* Premium Loading State */}
                        {!isLoaded && (
                          <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-xl ${
                            isDarkMode ? 'bg-slate-800/50' : 'bg-gray-200/50'
                          }`}>
                            <div className="relative">
                              <div className={`w-12 h-12 border-3 rounded-full animate-spin ${
                                isDarkMode 
                                  ? 'border-slate-600 border-t-blue-400' 
                                  : 'border-gray-300 border-t-blue-600'
                              }`}></div>
                              <div className={`absolute inset-0 w-12 h-12 border-3 rounded-full animate-ping ${
                                isDarkMode 
                                  ? 'border-blue-400/20' 
                                  : 'border-blue-600/20'
                              }`}></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Priority Badge */}
                        {index < 3 && (
                          <div className="absolute top-4 left-4 z-30">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-500 opacity-0 group-hover:opacity-100 backdrop-blur-xl border ${
                              index === 0 
                                ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white border-amber-400/30' 
                                : index === 1
                                ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white border-blue-400/30'
                                : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border-green-400/30'
                            }`}>
                              {index === 0 ? '⭐ Featured' : index === 1 ? '🎯 Priority' : '💎 Highlight'}
                            </span>
                          </div>
                        )}
                        
                        {/* Image with advanced effects */}
                        <img
                          src={image}
                          alt={`${blog.title} - Image ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            !isLoaded ? 'opacity-0' : 'opacity-100'
                          }`}
                          loading={index < 6 ? 'eager' : 'lazy'}
                          onLoad={() => handleImageLoad(index)}
                        />
                        
                        {/* Premium Overlay Effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        
                        {/* Interactive Elements */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                          {/* Expand Button */}
                          <div className="flex justify-end">
                            <div className="bg-white/20 backdrop-blur-xl text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-500 hover:bg-white/30 border border-white/30">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Image Info */}
                          <div className="flex justify-between items-end">
                            <div className="space-y-2">
                              <span className="inline-block bg-black/50 backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                {index + 1} of {blog.images.length}
                              </span>
                            </div>
                            
                            <div className="text-white/80 text-sm font-medium">
                              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Premium Image Modal */}
            {selectedImage && (
              <div 
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-2xl"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-7xl max-h-full">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-16 right-0 text-white/60 hover:text-white transition-all duration-300 z-10 p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/40"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={selectedImage}
                    alt="Expanded view"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            )}

            {/* Premium Content Section */}
            <section className="max-w-4xl mx-auto">
              <div className={`space-y-8 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                <div className="space-y-2 mb-12">
                  <h2 className={`text-3xl lg:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    The Story
                  </h2>
                  <div className={`w-20 h-1 rounded-full ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  }`} />
                </div>
                
                <div className="space-y-8">
                  {blog.content.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
                    <div 
                      key={index}
                      className={`group transition-all duration-500 hover:translate-x-2 ${
                        isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                      }`}
                    >
                      <p className="text-lg lg:text-xl leading-relaxed font-medium tracking-wide">
                        {paragraph}
                      </p>
                      {index < blog.content.split('\n').filter(p => p.trim()).length - 1 && (
                        <div className={`mt-6 w-full h-px ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-transparent via-slate-700 to-transparent' 
                            : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Premium Footer */}
            <footer className={`border-t-2 pt-12 mt-20 ${
              isDarkMode ? 'border-slate-800' : 'border-gray-200'
            }`}>
              <div className="space-y-8">
                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <button className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 border ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                      <span className="font-semibold">Share Story</span>
                    </button>
                    
                    <button className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 border ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className="font-semibold">Save</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                      </svg>
                    </button>
                    <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'bg-pink-600/20 text-pink-400 hover:bg-pink-600/30' 
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.120.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Credits */}
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t ${
                  isDarkMode ? 'border-slate-800' : 'border-gray-200'
                }`}>
                  <div className={`flex items-center space-x-4 text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                      isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isDarkMode ? 'bg-green-400' : 'bg-green-500'
                      } animate-pulse`} />
                      <span>Published</span>
                    </div>
                    <span>© {new Date().getFullYear()}</span>
                    <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-400'}`} />
                    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      DILG Calapan City
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-3 text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Reading time: ~{Math.ceil(blog.content.split(' ').length / 200)} min</span>
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;