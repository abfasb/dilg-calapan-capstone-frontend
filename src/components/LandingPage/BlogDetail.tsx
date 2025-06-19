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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.add(theme);
    
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/get-blogs/${id}`);
        setBlog(data);
        
        // Calculate reading stats
        const words = data.content.split(/\s+/).length;
        setWordCount(words);
        setEstimatedReadTime(Math.ceil(words / 200)); // Average reading speed
      } catch (err) {
        setError('Failed to load blog. Please try again later.');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(scrollPercent);
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, theme]);

  // Auto-play gallery
  useEffect(() => {
    if (isAutoPlaying && blog?.images && blog.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % blog.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, blog?.images]);

  const getOptimizedGridLayout = (index: number, total: number) => {
    const layouts: { [key: number]: string[] } = {
      1: ['col-span-12 row-span-3 aspect-[21/9] lg:aspect-[21/8]'],
      
      2: [
        'col-span-12 lg:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-12 lg:col-span-4 row-span-2 aspect-[4/5]'
      ],
      
      3: [
        'col-span-12 lg:col-span-7 row-span-3 aspect-[16/9]',
        'col-span-6 lg:col-span-5 row-span-2 aspect-[4/3]',
        'col-span-6 lg:col-span-5 aspect-[4/3]'
      ],
      
      4: [
        'col-span-12 lg:col-span-6 row-span-3 aspect-[4/5]',
        'col-span-12 lg:col-span-6 row-span-2 aspect-[16/9]',
        'col-span-6 lg:col-span-3 aspect-square',
        'col-span-6 lg:col-span-3 aspect-square'
      ],
      
      5: [
        'col-span-12 lg:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-6 lg:col-span-2 row-span-2 aspect-[3/4]',
        'col-span-6 lg:col-span-2 row-span-2 aspect-[3/4]',
        'col-span-6 lg:col-span-6 aspect-[16/9]',
        'col-span-6 lg:col-span-6 aspect-[16/9]'
      ],
      
      6: [
        'col-span-12 lg:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-6 lg:col-span-2 aspect-square',
        'col-span-6 lg:col-span-2 aspect-square',
        'col-span-4 lg:col-span-2 aspect-[4/3]',
        'col-span-4 lg:col-span-2 aspect-[4/3]',
        'col-span-4 lg:col-span-2 aspect-[4/3]'
      ]
    };

    if (total > 6) {
      const patterns = [
        'col-span-12 lg:col-span-6 row-span-3 aspect-[16/9]',
        'col-span-6 lg:col-span-3 row-span-2 aspect-square',
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

  const nextImage = () => {
    if (blog?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % blog.images.length);
    }
  };

  const prevImage = () => {
    if (blog?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + blog.images.length) % blog.images.length);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-16">
      <div className={`relative h-[60vh] lg:h-[75vh] rounded-[2rem] lg:rounded-[3rem] overflow-hidden ${
        isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 space-y-6">
          <div className={`h-4 w-40 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
          <div className={`h-16 w-4/5 rounded-3xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
          <div className={`h-4 w-1/3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-8 auto-rows-max">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'} ${
              i === 0 ? 'col-span-12 lg:col-span-8 h-96' : 'col-span-6 lg:col-span-2 h-64'
            }`}
          />
        ))}
      </div>
      
      <div className="space-y-8 max-w-4xl">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`h-5 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'} ${
            i % 4 === 2 ? 'w-3/4' : i % 4 === 3 ? 'w-5/6' : 'w-full'
          }`} />
        ))}
      </div>
    </div>
  );

  if (loading) return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {renderLoadingSkeleton()}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className={`max-w-md w-full text-center p-12 rounded-[2rem] backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-700/50 shadow-2xl shadow-slate-950/50' 
                : 'bg-white/80 border-white/20 shadow-2xl shadow-gray-900/10'
            }`}>
              <div className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30' 
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'
              }`}>
                <svg className={`w-12 h-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Oops! Something went wrong
              </h3>
              <p className={`mb-8 text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className={`w-full px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
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
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className={`text-center ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              <h2 className={`text-4xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Story Not Found
              </h2>
              <p className="text-xl leading-relaxed">The story you're looking for doesn't exist in our collection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      
      {/* Enhanced Progress Bar */}
      <div className={`fixed top-0 left-0 h-1.5 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
      }`} 
      style={{ width: `${readingProgress}%` }} />

      {/* Floating Toolbar */}
      {isScrolled && (
        <div className={`fixed bottom-8 right-8 flex flex-col space-y-3 z-40`}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`w-14 h-14 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 group ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-700/50 text-white hover:bg-slate-800/90' 
                : 'bg-white/80 border-white/20 text-gray-700 hover:bg-white/90'
            }`}
          >
            <svg className="w-6 h-6 mx-auto transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          
          <button
            onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
            className={`w-14 h-14 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 group ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-700/50 text-white hover:bg-slate-800/90' 
                : 'bg-white/80 border-white/20 text-gray-700 hover:bg-white/90'
            }`}
          >
            <svg className="w-6 h-6 mx-auto transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Hero Section - Enhanced */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className={`relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden mb-20 ${
            blog.images.length > 0 ? 'h-[60vh] lg:h-[80vh]' : 'h-[50vh]'
          } ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' 
              : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
          }`}>
            {/* Hero Background with Slideshow */}
            {blog.images.length > 0 && (
              <>
                <div className="absolute inset-0">
                  <img
                    src={blog.images[currentImageIndex]}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                </div>
                
                {/* Image Navigation */}
                {blog.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-8">
                    <button
                      onClick={prevImage}
                      className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-xl text-white border border-white/20 hover:bg-black/40 transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-xl text-white border border-white/20 hover:bg-black/40 transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Auto-play Toggle */}
                {blog.images.length > 1 && (
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`absolute top-8 right-8 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                      isAutoPlaying 
                        ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                        : 'bg-white/10 border-white/20 text-white'
                    }`}
                  >
                    {isAutoPlaying ? 'Auto ⏸' : 'Auto ▶'}
                  </button>
                )}
                
                {/* Image Indicators */}
                {blog.images.length > 1 && (
                  <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {blog.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Enhanced Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-16">
              <div className="max-w-5xl space-y-8">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className={`inline-flex items-center px-5 py-3 rounded-full text-sm font-bold backdrop-blur-xl border ${
                    isDarkMode || blog.images.length > 0
                      ? 'bg-white/15 border-white/25 text-white'
                      : 'bg-black/15 border-black/25 text-gray-900'
                  }`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(blog.date), 'MMMM dd, yyyy')}
                  </span>
                  
                  <span className={`inline-flex items-center px-5 py-3 rounded-full text-sm font-bold backdrop-blur-xl border ${
                    isDarkMode || blog.images.length > 0
                      ? 'bg-white/15 border-white/25 text-white'
                      : 'bg-black/15 border-black/25 text-gray-900'
                  }`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {estimatedReadTime} min read • {wordCount.toLocaleString()} words
                  </span>
                  
                  {blog.images.length > 0 && (
                    <span className={`inline-flex items-center px-5 py-3 rounded-full text-sm font-bold backdrop-blur-xl border ${
                      isDarkMode || blog.images.length > 0
                        ? 'bg-white/15 border-white/25 text-white'
                        : 'bg-black/15 border-black/25 text-gray-900'
                    }`}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {blog.images.length} Visual{blog.images.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <h1 className={`text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.85] ${
                  isDarkMode || blog.images.length > 0 ? 'text-white' : 'text-gray-900'
                } drop-shadow-2xl`}>
                  {blog.title}
                </h1>
                
                {/* Story Summary */}
                <p className={`text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl ${
                  isDarkMode || blog.images.length > 0 ? 'text-white/90' : 'text-gray-800'
                } drop-shadow-lg`}>
                  {blog.content.split('\n')[0].substring(0, 200)}...
                </p>
              </div>
            </div>
          </div>

          <article className="space-y-24">
            {/* Premium Gallery Section */}
            {blog.images.length > 0 && (
              <section className="space-y-16">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <h2 className={`text-4xl lg:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Visual Journey
                    </h2>
                    <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Immerse yourself in {blog.images.length} carefully curated visual{blog.images.length === 1 ? '' : 's'} that tell this story
                    </p>
                  </div>
                  
                  <div className={`hidden sm:flex items-center space-x-3 text-sm font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    <span>Click to expand</span>
                  </div>
                </div>
                
                {/* Enhanced Magazine Grid */}
                <div className="grid grid-cols-12 gap-6 lg:gap-10 auto-rows-max">
                  {blog.images.map((image, index) => {
                    const layoutClass = getOptimizedGridLayout(index, blog.images.length);
                    const isLoaded = imageLoadStates[index];
                    
                    return (
                      <div
                        key={index}
                        className={`relative group overflow-hidden rounded-2xl lg:rounded-[2rem] cursor-pointer transition-all duration-700 hover:scale-[1.02] hover:-translate-y-3 ${layoutClass} ${
                          isDarkMode 
                            ? 'hover:shadow-2xl hover:shadow-black/60' 
                            : 'hover:shadow-2xl hover:shadow-black/25'
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        {/* Enhanced Loading State */}
                        {!isLoaded && (
                          <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-xl ${
                            isDarkMode ? 'bg-slate-800/60' : 'bg-gray-200/60'
                          }`}>
                            <div className="relative">
                              <div className={`w-16 h-16 border-4 rounded-full animate-spin ${
                                isDarkMode 
                                  ? 'border-slate-600 border-t-blue-400' 
                                  : 'border-gray-300 border-t-blue-600'
                              }`}></div>
                              <div className={`absolute inset-0 w-16 h-16 border-4 rounded-full animate-ping ${
                                isDarkMode 
                                  ? 'border-blue-400/20' 
                                  : 'border-blue-600/20'
                              }`}></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Priority Badges */}
                        {index < 3 && (
                          <div className="absolute top-6 left-6 z-30">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black transition-all duration-500 opacity-0 group-hover:opacity-100 backdrop-blur-xl border ${
                              index === 0 
                                ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white border-amber-400/40 shadow-lg shadow-amber-500/25' 
                                : index === 1
                                ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white border-blue-400/40 shadow-lg shadow-blue-500/25'
                                : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border-green-400/40 shadow-lg shadow-green-500/25'
                            }`}>
                              {index === 0 ? '⭐ Hero' : index === 1 ? '🎯 Featured' : '💎 Highlight'}
                            </span>
                          </div>
                        )}
                        
                        {/* Premium Image Display */}
                        <img
                          src={image}
                          alt={`${blog.title} - Visual ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            !isLoaded ? 'opacity-0' : 'opacity-100'
                          }`}
                          loading={index < 6 ? 'eager' : 'lazy'}
                          onLoad={() => handleImageLoad(index)}
                        />
                        
                        {/* Enhanced Overlay Effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        
                        {/* Premium Interactive Elements */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="flex justify-end">
                            <div className="bg-white/25 backdrop-blur-xl text-white p-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-500 hover:bg-white/35 border border-white/30 shadow-xl">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div className="space-y-3">
                              <span className="inline-block bg-black/60 backdrop-blur-xl text-white text-sm font-black px-4 py-2 rounded-full border border-white/30 shadow-lg">
                                {index + 1} of {blog.images.length}
                              </span>
                            </div>
                            
                            <div className="text-white text-base font-bold flex items-center space-x-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Expand</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Enhanced Image Modal */}
            {selectedImage && (
              <div 
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-3xl"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-7xl max-h-full">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-20 right-0 text-white/70 hover:text-white transition-all duration-300 z-10 p-4 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 hover:bg-black/50 shadow-2xl"
                    aria-label="Close modal"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={selectedImage}
                    alt="Expanded view"
                    className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            )}

            {/* Enhanced Content Section */}
            <section className="max-w-5xl mx-auto">
              <div className={`space-y-12 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                <div className="space-y-4 mb-16">
                  <h2 className={`text-4xl lg:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    The Complete Story
                  </h2>
                  <div className={`w-24 h-1.5 rounded-full ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                  }`} />
                  <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Dive deep into every detail of this captivating narrative
                  </p>
                </div>
                
                <div className="space-y-12">
                  {blog.content.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
                    <div 
                      key={index}
                      className={`group transition-all duration-500 hover:translate-x-3 ${
                        isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                      }`}
                    >
                      <p className="text-xl lg:text-2xl leading-relaxed font-medium tracking-wide">
                        {paragraph}
                      </p>
                      {index < blog.content.split('\n').filter(p => p.trim()).length - 1 && (
                        <div className={`mt-8 w-full h-px ${
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

            {/* Enhanced Premium Footer */}
            <footer className={`border-t-2 pt-16 mt-24 ${
              isDarkMode ? 'border-slate-800' : 'border-gray-200'
            }`}>
              <div className="space-y-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <button className={`group flex items-center space-x-4 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 border ${
                      isDarkMode 
                        ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/60 text-slate-300 hover:text-white shadow-lg hover:shadow-xl' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                      <span className="font-bold text-lg">Share Story</span>
                    </button>
                    
                    <button className={`group flex items-center space-x-4 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 border ${
                      isDarkMode 
                        ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/60 text-slate-300 hover:text-white shadow-lg hover:shadow-xl' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-lg">Save to Collection</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {['Twitter', 'Facebook', 'Pinterest', 'LinkedIn'].map((platform) => (
                      <button key={platform} className={`p-4 rounded-full transition-all duration-300 hover:scale-110 ${
                        platform === 'Twitter' ? (isDarkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100') :
                        platform === 'Facebook' ? (isDarkMode ? 'bg-blue-700/20 text-blue-400 hover:bg-blue-700/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100') :
                        platform === 'Pinterest' ? (isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100') :
                        (isDarkMode ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')
                      }`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          {platform === 'Twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>}
                          {platform === 'Facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                          {platform === 'Pinterest' && <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>}
                          {platform === 'LinkedIn' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className={`flex flex-col lg:flex-row items-center justify-between gap-6 pt-12 border-t ${
                  isDarkMode ? 'border-slate-800' : 'border-gray-200'
                }`}>
                  <div className={`flex items-center space-x-6 text-sm font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <div className={`flex items-center space-x-3 px-5 py-3 rounded-full ${
                      isDarkMode ? 'bg-slate-800/60' : 'bg-gray-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        isDarkMode ? 'bg-green-400' : 'bg-green-500'
                      } animate-pulse`} />
                      <span>Live & Published</span>
                    </div>
                    <span>© {new Date().getFullYear()}</span>
                    <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-400'}`} />
                    <span className="font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      DILG Calapan City
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-6 text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{estimatedReadTime}-minute experience</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v11.586l-2-2V4H8v11.586l-2 2V4a1 1 0 011-1z" />
                      </svg>
                      <span>{wordCount.toLocaleString()} words</span>
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