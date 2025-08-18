import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../NavBar';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
}

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("dark"); 
    }
  }, []);

  console.log('hello world');
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/get-blogs`);
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="relative">
          <div className={`w-20 h-20 rounded-full border-4 ${
            theme === 'dark' ? 'border-purple-500' : 'border-indigo-500'
          } border-t-transparent animate-spin`}></div>
          <div 
            className={`absolute inset-0 w-20 h-20 rounded-full border-4 ${
              theme === 'dark' ? 'border-pink-500' : 'border-blue-500'
            } border-b-transparent animate-spin opacity-75`} 
            style={{
              animationDirection: 'reverse', 
              animationDuration: '1.5s'
            }}
          ></div>
          <div className={`absolute inset-2 w-16 h-16 rounded-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          } animate-pulse`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-10 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-gradient-to-r from-blue-400 to-indigo-400'
        } animate-pulse`}></div>
        <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-10 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-violet-600 to-purple-600' 
            : 'bg-gradient-to-r from-indigo-400 to-purple-400'
        } animate-pulse`} style={{animationDelay: '2s'}}></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full opacity-20 ${
              theme === 'dark' ? 'bg-white' : 'bg-indigo-600'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <Navbar toggleTheme={toggleTheme} theme={theme}/>
      
      <div className="relative z-10 max-w-7xl pt-32 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-white via-purple-200 to-pink-200' 
              : 'from-gray-900 via-indigo-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            Latest Blogs
          </h1>
          <div className={`w-32 h-1 mx-auto rounded-full bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-purple-500 to-pink-500' 
              : 'from-indigo-500 to-purple-500'
          } animate-pulse`}></div>
          <p className={`mt-6 text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } max-w-2xl mx-auto leading-relaxed`}>
            Discover amazing stories, insights, and ideas that will inspire your journey
          </p>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="group relative block transform transition-all duration-700 hover:scale-105 hover:-rotate-1"
              onMouseEnter={() => setHoveredCard(blog._id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/30 hover:bg-white/15' 
                  : 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl hover:shadow-indigo-500/30 hover:bg-white/90'
              }`}>
                
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  theme === 'dark' 
                    ? 'from-purple-600/20 via-pink-600/10 to-violet-600/20' 
                    : 'from-indigo-600/20 via-purple-600/10 to-blue-600/20'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Image Section */}
                {blog.images.length > 0 && (
                  <div className="relative overflow-hidden h-56 rounded-t-3xl">
                    <img
                      src={blog.images[0]}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      theme === 'dark' 
                        ? 'from-gray-900/60 via-transparent to-transparent' 
                        : 'from-gray-900/40 via-transparent to-transparent'
                    } group-hover:from-purple-900/70 transition-all duration-500`}></div>
                    
                    {/* Floating Date Badge */}
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-semibold ${
                      theme === 'dark' 
                        ? 'bg-white/20 text-white backdrop-blur-md border border-white/30' 
                        : 'bg-white/90 text-gray-800 backdrop-blur-md border border-white/50'
                    } shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                      {format(new Date(blog.date), 'MMM dd')}
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-8 relative">
                  {/* Animated top border */}
                  <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${
                    theme === 'dark' 
                      ? 'from-transparent via-purple-400 to-transparent' 
                      : 'from-transparent via-indigo-500 to-transparent'
                  } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>
                  
                  <h2 className={`text-2xl font-bold mb-4 leading-tight transition-all duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } group-hover:text-transparent group-hover:bg-gradient-to-r ${
                    theme === 'dark' 
                      ? 'group-hover:from-purple-300 group-hover:to-pink-300' 
                      : 'group-hover:from-indigo-600 group-hover:to-purple-600'
                  } group-hover:bg-clip-text`}>
                    {blog.title}
                  </h2>
                  
                  <p className={`text-sm mb-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-purple-300 group-hover:text-pink-300' 
                      : 'text-indigo-600 group-hover:text-purple-600'
                  }`}>
                    {format(new Date(blog.date), 'MMMM dd, yyyy')}
                  </p>
                  
                  <p className={`leading-relaxed mb-6 transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-300 group-hover:text-gray-200' 
                      : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                    {truncateContent(blog.content)}
                  </p>
                  
                  <div className={`inline-flex items-center text-sm font-semibold transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-purple-400 group-hover:text-pink-300' 
                      : 'text-indigo-600 group-hover:text-purple-600'
                  } group-hover:translate-x-1`}>
                    Read More
                    <svg 
                      className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  theme === 'dark' 
                    ? 'shadow-2xl shadow-purple-500/25' 
                    : 'shadow-2xl shadow-indigo-500/25'
                } pointer-events-none`}></div>
              </div>
              
              {/* Floating particles on hover */}
              {hoveredCard === blog._id && (
                <div className="absolute -inset-4 pointer-events-none">
                  <div className={`absolute top-0 left-0 w-3 h-3 rounded-full ${
                    theme === 'dark' ? 'bg-purple-400' : 'bg-indigo-400'
                  } animate-ping`}></div>
                  <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-pink-400' : 'bg-purple-400'
                  } animate-ping`} style={{animationDelay: '0.5s'}}></div>
                  <div className={`absolute bottom-0 left-0 w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-violet-400' : 'bg-blue-400'
                  } animate-ping`} style={{animationDelay: '1s'}}></div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    theme === 'dark' ? 'bg-purple-400' : 'bg-indigo-400'
                  } animate-ping`} style={{animationDelay: '1.5s'}}></div>
                </div>
              )}
            </Link>
          ))}
        </div>
        
        {/* Empty state with stunning design */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className={`relative w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-purple-600 to-pink-600' 
                : 'from-indigo-600 to-purple-600'
            } flex items-center justify-center shadow-2xl`}>
              <div className={`absolute inset-0 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                  : 'bg-gradient-to-r from-indigo-400 to-purple-400'
              } animate-ping opacity-75`}></div>
              <svg className="w-16 h-16 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-white to-purple-200' 
                : 'from-gray-900 to-indigo-600'
            } bg-clip-text text-transparent`}>
              No blogs yet
            </h3>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Check back later for amazing content!
            </p>
          </div>
        )}
      </div>
      
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
        } text-white shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-xl backdrop-blur-sm`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

        {/* @ts-ignore */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Glassmorphism enhancements */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#1f2937' : '#f1f5f9'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'linear-gradient(to bottom, #8b5cf6, #ec4899)' : 'linear-gradient(to bottom, #4f46e5, #7c3aed)'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'linear-gradient(to bottom, #7c3aed, #db2777)' : 'linear-gradient(to bottom, #4338ca, #6d28d9)'};
        }
      `}</style>
    </div>
  );
};

export default BlogList;