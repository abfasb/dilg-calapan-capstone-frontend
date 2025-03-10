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

const BlogDetail =() => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/get-blogs/${id}`);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!blog) return <div className="text-center py-8">Blog not found</div>;

  const getGridClass = (length: number) => {
    if (length === 1) return 'grid-cols-1';
    if (length === 2) return 'grid-cols-2';
    if (length === 3) return 'grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3';
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose lg:prose-xl max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <time className="text-gray-500 text-lg">
            {format(new Date(blog.date), 'MMMM dd, yyyy')}
          </time>
        </header>

        {blog.images.length > 0 && (
          <div className={`grid ${getGridClass(blog.images.length)} gap-4 mb-12`}>
            {blog.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={image}
                  alt={`${blog.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>
      </article>
    </div>
    </>
  );
};

export default BlogDetail;