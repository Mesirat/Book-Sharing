import React, { useEffect, useState } from "react";
import api from "../Services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const MostLikedBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();

  const handleCardClick = (book) => {
    navigate(`/bookDetail`, { state: { book } });
  };

  useEffect(() => {
    const fetchMostLikedBooks = async () => {
      try {
        const response = await api.get("/books/mostLiked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data || []);
      } catch (err) {
        console.error("Error fetching most liked books", err);
        setError("Failed to load featured books.");
      }
    };

    fetchMostLikedBooks();
  }, []);

  return (
    <>
      {books.length > 0 && (
        <div className="mt-24 p-4">
          <div className="mb-16 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-sans">
              Top Picks by Readers
            </h1>
            <div className="text-xl mt-6 mb-4 md:mb-0">
              <h2 className="mb-1 text-center max-w-2xl">
                Discover the most beloved stories handpicked by our community of
                readers.
              </h2>
            </div>
          </div>

          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-6 mb-8">
            {books.map((book, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(book)}
                className="flex flex-col items-center p-4 transition-transform duration-300 bg-white cursor-pointer rounded-md shadow"
              >
                <div className="w-full h-80 overflow-hidden rounded-md">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    src={book.thumbnail}
                    alt={book.title}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-2xl my-2 text-center">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600 text-center">
                  by <strong>{book.authors}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MostLikedBooks;
