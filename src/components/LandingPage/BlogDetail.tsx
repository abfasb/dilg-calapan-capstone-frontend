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
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<{[key: number]: boolean}>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode from localStorage or system preference
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkMode);
    
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
  }, [id]);

  const getOptimizedGridLayout = (index: number, total: number) => {
    // More precise grid layouts with exact calculations
    const layouts: { [key: number]: string[] } = {
      1: ['col-span-12 row-span-3 aspect-[21/9]'],
      
      2: [
        'col-span-12 md:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-12 md:col-span-4 row-span-3 aspect-[4/3]'
      ],
      
      3: [
        'col-span-12 md:col-span-6 row-span-4 aspect-[3/4]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square'
      ],
      
      4: [
        'col-span-12 md:col-span-6 row-span-4 aspect-[3/4]',
        'col-span-12 md:col-span-6 row-span-2 aspect-[3/2]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square'
      ],
      
      5: [
        'col-span-12 md:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-6 md:col-span-2 row-span-2 aspect-[3/4]',
        'col-span-6 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-6 md:col-span-4 row-span-2 aspect-[2/1]',
        'col-span-6 md:col-span-4 row-span-2 aspect-[2/1]'
      ],
      
      6: [
        'col-span-12 md:col-span-6 row-span-4 aspect-[3/4]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square'
      ],
      
      7: [
        'col-span-12 md:col-span-8 row-span-3 aspect-[16/9]',
        'col-span-12 md:col-span-4 row-span-2 aspect-[4/3]',
        'col-span-4 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-4 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-4 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square'
      ],
      
      8: [
        'col-span-12 md:col-span-6 row-span-4 aspect-[3/4]',
        'col-span-12 md:col-span-6 row-span-2 aspect-[3/1]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-3 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-3 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-3 md:col-span-2 row-span-1 aspect-[3/2]',
        'col-span-3 md:col-span-6 row-span-2 aspect-[3/1]'
      ],
      
      9: [
        'col-span-12 md:col-span-8 row-span-4 aspect-[2/1]',
        'col-span-12 md:col-span-4 row-span-2 aspect-[4/3]',
        'col-span-12 md:col-span-4 row-span-2 aspect-[4/3]',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-square'
      ],
      
      10: [
        'col-span-12 md:col-span-6 row-span-4 aspect-[3/4]',
        'col-span-12 md:col-span-6 row-span-2 aspect-[3/1]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-3 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-3 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-3 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-3 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square'
      ]
    };

    // For more than 10 images, use a repeating pattern
    if (total > 10) {
      const patterns = [
        'col-span-12 md:col-span-6 row-span-3 aspect-[3/2]',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-6 md:col-span-3 row-span-2 aspect-square',
        'col-span-4 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-4 md:col-span-2 row-span-2 aspect-[4/3]',
        'col-span-4 md:col-span-2 row-span-2 aspect-[4/3]'
      ];
      return patterns[index % patterns.length];
    }

    return layouts[total]?.[index] || 'col-span-6 md:col-span-3 row-span-2 aspect-square';
  };

  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: true }));
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className={`h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-3/4 mb-4`}></div>
      <div className="grid grid-cols-12 auto-rows-fr gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl ${i === 0 ? 'col-span-8 row-span-3' : 'col-span-4 row-span-2'}`}></div>
        ))}
      </div>
      <div className="space-y-4">
        <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
        <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
      </div>
    </div>
  );

  if (loading) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderLoadingSkeleton()}
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className={`${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'} p-6 rounded-lg inline-block`}>
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition-colors`}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  if (!blog) return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} text-center py-8`}>
      Blog not found
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="space-y-12">
          <header className={`space-y-6 border-b pb-8 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h1 className={`text-4xl font-bold md:text-5xl lg:text-6xl tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {blog.title}
            </h1>
            <div className={`flex items-center space-x-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <time className="flex items-center text-sm font-medium">
                <span className="mr-2">📅</span>
                {format(new Date(blog.date), 'MMMM dd, yyyy')}
              </time>
              {blog.images.length > 0 && (
                <span className="flex items-center text-sm font-medium">
                  <span className="mr-2">📸</span>
                  {blog.images.length} {blog.images.length === 1 ? 'Image' : 'Images'}
                </span>
              )}
            </div>
          </header>

          {blog.images.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gallery</h2>
                <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>Click to expand</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-12 auto-rows-fr gap-3 md:gap-4 lg:gap-6" style={{ minHeight: '400px' }}>
                {blog.images.map((image, index) => {
                  const layoutClass = getOptimizedGridLayout(index, blog.images.length);
                  const isLoaded = imageLoadStates[index];
                  
                  return (
                    <div
                      key={index}
                      className={`relative group overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1 ${layoutClass} ${isDarkMode ? 'hover:shadow-2xl hover:shadow-black/40' : 'hover:shadow-2xl hover:shadow-black/20'}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      {/* Loading skeleton */}
                      {!isLoaded && (
                        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse flex items-center justify-center`}>
                          <div className={`w-8 h-8 border-2 ${isDarkMode ? 'border-gray-600 border-t-gray-400' : 'border-gray-300 border-t-gray-600'} rounded-full animate-spin`}></div>
                        </div>
                      )}
                      
                      {/* Featured badge for first few images */}
                      {index < 3 && (
                        <div className="absolute top-3 left-3 z-30 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {index === 0 ? 'Hero' : 'Featured'}
                        </div>
                      )}
                      
                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <img
                        src={image}
                        alt={`${blog.title} - Image ${index + 1}`}
                        className={`w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        onLoad={() => handleImageLoad(index)}
                      />
                      
                      {/* Image overlay content */}
                      <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="text-white">
                          <span className="text-xs md:text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            Image {index + 1} of {blog.images.length}
                          </span>
                        </div>
                      </div>
                      
                      {/* Expand icon */}
                      <div className="absolute top-3 right-3 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 hover:bg-white/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-7xl max-h-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedImage}
                  alt="Expanded view"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          )}

          <div className={`prose prose-lg max-w-none transition-colors duration-300 ${
            isDarkMode 
              ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-900/20' 
              : 'text-gray-800 prose-headings:text-gray-900 prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-4 prose-blockquote:bg-blue-50'
          } prose-img:rounded-xl prose-img:shadow-lg prose-pre:rounded-xl prose-pre:p-6 prose-table:border-collapse prose-table:w-full prose-th:p-4 prose-th:text-left prose-td:p-4 prose-td:border-t ${
            isDarkMode ? 'prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-th:bg-gray-800 prose-td:border-gray-700' : 'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-th:bg-gray-50 prose-td:border-gray-100'
          }`}>
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 leading-7">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className={`border-t pt-8 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>© {new Date().getFullYear()} Your Blog Platform</span>
              <div className="flex space-x-4">
                <button className={`${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'} transition-colors flex items-center space-x-1`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
                <button className={`${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'} transition-colors flex items-center space-x-1`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Report</span>
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;