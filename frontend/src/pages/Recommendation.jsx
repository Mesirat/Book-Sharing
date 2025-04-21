import React, { useState, useEffect } from "react";
import axios from "axios";
import Modals from "../components/Modals";
import Cards from "../components/Cards.jsx";
import { Loader } from "lucide-react";

const Recommendation = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [bookItem, setBookItem] = useState(null);
  const [Loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const query = user?.favouriteGener?.length 
    ? user.favouriteGener.map((genre) => encodeURIComponent(genre)).join(",") 
    : null;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user && user._id) {
        try {
          setLoading(true); 
          setError(null);    

          if (query) {
            const booksResponse = await axios.get(
              'http://localhost:5000/books/search', {
                params: { query, page }
              }
            );
            setBooks(booksResponse.data.items);
            setTotalResults(booksResponse.data.totalItems);
            setLoading(false); 
          }
        } catch (err) {
          console.error(err);
          const errorMessage = err.response?.data?.message || "Failed to load recommendations. Please try again later.";
          setError(errorMessage);  
          setLoading(false);      
        }
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [query, user, page]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && books.length < totalResults) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    }
  };

  if (Loading) return <Loader className="w-10 h-10 animate-spin mx-auto" />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <div className="grid min-h-screen w-full justify-center items-center overflow-hidden px-8 lg:mt-[50px] bg-gray-100">
        {/* Header */}
        <div className="w-full flex justify-center mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl text-center font-serif text-blue-700">
            Recommended Books
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Cards books={books} setShow={setShow} setBookItem={setBookItem} />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            onClick={() => handlePageChange('prev')} 
            disabled={page <= 1}
            className={`px-4 py-2 rounded-md ${page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Prev
          </button>
          <button 
            onClick={() => handlePageChange('next')} 
            disabled={books.length === 0 || books.length < 10}
            className={`px-4 py-2 rounded-md ${books.length < 10 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {show && <Modals bookItem={bookItem} setShow={setShow} />}
    </>
  );
};

export default Recommendation;
