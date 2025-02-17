import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../utils/AnimateData.json';

const NotFoundPage : React.FC= () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Oops! Page not found.</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg text-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 transition"
      >
        Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
