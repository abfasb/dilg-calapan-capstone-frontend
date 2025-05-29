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

  if (loading) return <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Loading...</div>;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar toggleTheme={toggleTheme} theme={theme}/>
      <div className="max-w-7xl pt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Latest Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className={`rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {blog.images.length > 0 && (
                <img
                  src={blog.images[0]}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {blog.title}
                </h2>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {format(new Date(blog.date), 'MMMM dd, yyyy')}
                </p>
                <p className={`line-clamp-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {blog.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;