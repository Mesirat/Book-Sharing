import React, { useState, useCallback } from "react";
import { bookCategories } from "../utils/data";
import api from "../Services/api";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Cards from "./Cards";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState({ category: null, grade: null });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const token = useAuthStore.getState().token;

  const fetchBooks = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/books/search", {
        params: { category },
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });

      if (response.data?.length > 0) {
        setBooks(response.data);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(prevState => ({
      ...prevState,
      category,
    }));
    fetchBooks(category);
  };

  const handleGradeSelect = (subcategory, grade) => {
    setSelectedCategory(prevState => ({
      ...prevState,
      category: `${subcategory.parent},${grade}`,
      grade
    }));
    fetchBooks(`${subcategory.parent},${grade}`);
  };

  const handleToggleCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const categoriesToDisplay = showAllCategories
    ? Object.entries(bookCategories)
    : Object.entries(bookCategories).slice(0, 4);

  return (
    <div className="mb-16 px-4 md:px-16 mt-12">
      <h1 className="text-4xl md:text-5xl font-sans">Explore by Category</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mt-6">
        <div className="text-xl mb-4 md:mb-0 text-center md:text-left">
          <h1 className="mb-1">
            Embark on thrilling adventures, uncover futuristic worlds, and ignite your curiosity with every page
          </h1>
        </div>

        <button
          onClick={handleToggleCategories}
          className="flex bg-secondary hover:bg-gray-500 flex-row items-center justify-center mx-2 rounded-lg shadow-md transition duration-300 px-8 py-2 text-lg font-medium"
        >
          {showAllCategories ? "Hide Categories" : "All Categories"}
          {showAllCategories ? (
            <ArrowLeft className="ml-1" />
          ) : (
            <ArrowRight className="ml-1" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-6">
        {categoriesToDisplay.map(([parent, subcategories]) => (
          <div
            key={parent}
            className={`flex flex-col items-center rounded-2xl p-4 transition-transform duration-300 cursor-pointer ${
              selectedCategory.category === parent ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleCategoryClick(parent)}
          >
            <div className="w-full overflow-hidden h-80 rounded-md relative">
              {subcategories.map((subcategory, index) => (
                <div key={index} className="relative group w-full h-full">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    src={subcategory.image}
                    alt={`${parent} thumbnail ${index + 1}`}
                  />
                  <div className="absolute top-0 text-center left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-xl font-semibold">
                    <span>{subcategory.text}</span>
                  </div>

                  {subcategory.grades && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-11/12">
                      <select
                        className="w-full px-3 py-2 bg-white rounded-md shadow focus:outline-none "
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleGradeSelect({ parent, subcategory }, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Grade</option>
                        {subcategory.grades.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl my-2">{parent}</h2>
          </div>
        ))}
      </div>

      <div className="w-full mt-10">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {selectedCategory.category && !loading && !error && books.length === 0 && (
          <p className="text-center text-lg text-gray-600 flex flex-col items-center">
            📚 No books found in{" "}
            <span className="font-semibold">{selectedCategory.category}</span>
          </p>
        )}

        {selectedCategory.category && !loading && !error && books.length > 0 && (
          <>
            <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-6">
              Books in "{selectedCategory.category}" Category
            </h2>
            <Cards books={books} />
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
