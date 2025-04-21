import React, { useState } from "react";
// import { bookCategories } from "../data";
import axios from "axios";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async (category) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:5000/books/search",
        { params: { category } }
      );

      if (response.data?.items?.length > 0) {
        setBooks(response.data.items);
      } else {
        setBooks([]); // Handle no books scenario
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchBooks(category);
  };

  return (
    <div className="w-full flex flex-col items-center font-serif px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full flex justify-center mb-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl text-center">Categories</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 mb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:mx-[200px]">
        {Object.entries(bookCategories).map(([parent, subcategories]) => (
          <div
            key={parent}
            className="flex flex-col items-center rounded-md p-4 transition-transform duration-300 hover:scale-105 shadow-lg shadow-gray-400 bg-white cursor-pointer"
            onClick={() => handleCategoryClick(parent)}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {subcategories.map((subcategory, index) => (
                <img
                  key={index}
                  className="w-full h-32 object-cover rounded-md"
                  src={subcategory}
                  alt={`${parent} thumbnail ${index + 1}`}
                />
              ))}
            </div>
            <h2 className="font-bold text-black text-xl sm:text-2xl lg:text-3xl mb-4">
              {parent}
            </h2>
          </div>
        ))}
      </div>

      {/* Books Section */}
      <div className="w-full mt-10">
        {loading && <p className="text-center text-lg text-gray-600">Loading books...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {selectedCategory && !loading && !error && books.length === 0 && (
          <p className="text-center text-lg text-gray-600">
            No books found in the "{selectedCategory}" category.
          </p>
        )}

        {selectedCategory && !loading && !error && books.length > 0 && (
          <>
            <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-6">
              Books in "{selectedCategory}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/128x192?text=No+Image"
                    }
                    alt={book.volumeInfo.title || "Book Cover"}
                    className="w-32 h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
