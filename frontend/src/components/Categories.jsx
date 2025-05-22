
import React, { useState, useCallback, useEffect } from "react";
import { bookCategories } from "../utils/data";
import api from "../Services/api";
import { useAuthStore } from "../store/authStore";
import Cards from "./Cards";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("Educational");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = useAuthStore.getState().token;

  const fetchBooks = useCallback(
    async (category, page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/books/search", {
          params: { category, page, limit: 8 }, 
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });

        if (response.data?.books?.length > 0) {
          setBooks(response.data.books);
          setTotalPages(response.data.totalPages);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedGrade(null);
    setCurrentPage(1);
    fetchBooks(category, 1);
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setCurrentPage(1);
    fetchBooks(`${selectedCategory}_${grade.toLowerCase()}`, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchBooks(selectedCategory, newPage);
    }
  };

  useEffect(() => {
    fetchBooks(selectedCategory, currentPage);
  }, [selectedCategory, currentPage, fetchBooks]);

  return (
    <div className="mb-6 px-4 md:px-16 mt-24 py-6">
      <h1 className="text-4xl md:text-5xl font-sans ">Explore by Category</h1>

 <div className="flex overflow-x-auto space-x-12 mt-4 scrollbar-hide">
  {Object.keys(bookCategories).map((parent) => (
    <button
      key={parent}
      className={`p-2 px-2 rounded-md cursor-pointer ${
        selectedCategory === parent ? "bg-secondary text-white" : ""
      }`}
      onClick={() => handleCategoryClick(parent)}
    >
      {parent}
    </button>
  ))}
</div>



      {selectedCategory && (
        <div className="mt-6">
          {["Educational", "Reference"].includes(selectedCategory) && (
            <div className=" mb-4">
              <select
                className="px-3 py-2 bg-white rounded-md shadow focus:outline-none"
                onChange={(e) => handleGradeSelect(e.target.value)}
                value={selectedGrade || ""}
              >
                <option value="" disabled>
                  Select Grade
                </option>
                {["9", "10", "11", "12"].map((grade) => (
                  <option key={grade} value={`grade${grade}`}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : selectedCategory && books.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No books found.</p>
        ) : (
          <>
            <Cards books={books} />

             {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                className={`px-4 py-2 mr-2 bg-secondary text-white rounded-md hover:bg-gray-600 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>

              <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>

              <button
                className={`px-4 py-2 ml-2 bg-secondary text-white rounded-md hover:bg-gray-600 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </button>
            </div>
             )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
