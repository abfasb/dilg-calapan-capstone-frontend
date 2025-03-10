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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (<>
    <Navbar />
    <div className="max-w-7xl pt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blogs/${blog._id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {blog.images.length > 0 && (
              <img
                src={blog.images[0]}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {format(new Date(blog.date), 'MMMM dd, yyyy')}
              </p>
              <p className="text-gray-600 line-clamp-3">
                {blog.content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
};

export default BlogList;