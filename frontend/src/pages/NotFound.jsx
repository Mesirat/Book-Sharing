import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-xl font-medium text-gray-700 mt-4">
          Oops! Page not found.
        </h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
