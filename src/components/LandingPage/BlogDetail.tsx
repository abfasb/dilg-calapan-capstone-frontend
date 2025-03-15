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

  useEffect(() => {
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

  const getGridLayout = (index: number, total: number) => {
    const layouts: { [key: number]: string[] } = {
      1: ['col-span-3 row-span-2 aspect-[21/9]'],
      2: ['col-span-2', 'col-span-2'],
      3: ['col-span-2 row-span-2', 'col-span-1', 'col-span-1'],
      4: ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-2'],
      5: ['col-span-3 row-span-2', 'col-span-1', 'col-span-1', 'col-span-2', 'col-span-2'],
      6: ['col-span-2 row-span-2', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-1', 'col-span-2'],
      7: ['col-span-3 row-span-2', ...Array(6).fill('col-span-1')],
      8: ['col-span-2 row-span-2', ...Array(7).fill('col-span-1')]
    };

    return layouts[total]?.[index] || 'col-span-1 aspect-square';
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-12 bg-gray-200 rounded-full w-3/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderLoadingSkeleton()}
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <div className="bg-red-50 text-red-700 p-6 rounded-lg inline-block">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!blog) return <div className="text-center py-8">Blog not found</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="space-y-12">
          <header className="space-y-6 border-b pb-8 border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl tracking-tight leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-500">
              <time className="flex items-center text-sm font-medium">
                <span className="mr-2">📅</span>
                {format(new Date(blog.date), 'MMMM dd, yyyy')}
              </time>
            </div>
          </header>

          {blog.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-50 gap-6 grid-flow-dense">
              {blog.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl ${getGridLayout(index, blog.images.length)}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10" />
                  <img
                    src={image}
                    alt={`${blog.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    loading={index > 2 ? 'lazy' : 'eager'}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Image {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 
            prose-headings:text-gray-900 prose-headings:font-semibold
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700
            prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-4 prose-blockquote:bg-blue-50
            prose-img:rounded-xl prose-img:shadow-lg
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-50 prose-th:p-4 prose-th:text-left
            prose-td:p-4 prose-td:border-t prose-td:border-gray-100">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 leading-7">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="border-t pt-8 border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>© {new Date().getFullYear()} Your Blog Platform</span>
              <div className="flex space-x-4">
                <button className="hover:text-gray-700 transition-colors">Share</button>
                <button className="hover:text-gray-700 transition-colors">Report</button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};

export default BlogDetail;