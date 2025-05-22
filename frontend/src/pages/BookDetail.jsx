import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../Services/api";
import { Check, ThumbsUp, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API_URL = "http://localhost:5000/books";

const BookDetail = () => {
  const location = useLocation();
  const { book } = location.state || {};

  const user = useAuthStore((state) => state.user);

  const [likedBooks, setLikedBooks] = useState([]);
  const [laterReads, setLaterReads] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore.getState().token;
  const bookId = book.bookId ? book.bookId : book._id;
  if (!book) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No book data available.
      </div>
    );
  }

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const savedLaterReads =
      JSON.parse(localStorage.getItem("laterReads")) || [];
    setLikedBooks(savedLikes);
    setLaterReads(savedLaterReads);

    const fetchRatings = async () => {
      try {
        const response = await api.get(`/books/rate/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error("Error fetching book ratings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (book) fetchRatings();
  }, [book]);

  const handleAction = async (
    action,
    book,
    endpoint,
    stateSetter,
    localKey
  ) => {
    setIsProcessing(true);
    try {
      const response = await api.put(
        `/books/${endpoint}`,
        {
          bookId,
          title: book.title,
          authors: Array.isArray(book.authors)
            ? book.authors.join(", ")
            : typeof book.authors === "string"
            ? book.authors
            : "Unknown Author",

          thumbnail: book.thumbnail || "/assets/6.jpg",
          publisher: book.publisher || "Unknown Publisher",
          publishYear: book.publishedYear?.split("-")[0] || "N/A",
          description: book.description || "No description available.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      stateSetter(response.data[action]);
      localStorage.setItem(localKey, JSON.stringify(response.data[action]));
    } catch (error) {
      console.error(
        `Error performing ${action}:`,
        error.response?.data || error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = () => {
    handleAction("likedBooks", book, "LikeBook", setLikedBooks, "likedBooks");
  };

  const handleLaterRead = () => {
    handleAction("laterReads", book, "ReadLater", setLaterReads, "laterReads");
  };

  const handleRating = async (rating) => {
    try {
      await api.post(
        `books/rate`,
        {
          bookId,
          userId: user._id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserRating(rating);

      const response = await api.get(`/books/rate/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    }
  };

  const thumbnail = book.thumbnail;
  const title = book.title;
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors || "Unknown Author";
  const publisher = book.publisher;
  const publishYear = book.publishYear?.split("-")[0] || "N/A";
  const description = book.description || "No description available.";

  const isLiked = likedBooks.some(
    (likedBook) =>
      likedBook.bookId === book.bookId || likedBook.bookId === book._id
  );
  const isLaterRead = laterReads.some(
    (laterRead) =>
      laterRead.bookId === book.bookId || laterRead.bookId === book._id
  );

  return (
    <div className="bg-gray-50  p-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg px-3 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-4">
            <img
              src={thumbnail}
              alt={title}
              className="w-60 h-auto rounded-lg shadow-md object-cover"
            />
            <p className="text-gray-600 text-center lg:text-left">
              <strong>Published:</strong> {publisher} publication, {publishYear}
            </p>
            <p className="text-gray-700 italic text-center lg:text-left">
              By <span className="font-semibold underline">{authors}</span>
            </p>

            <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start w-full">
              <button
                onClick={handleLike}
                disabled={isProcessing}
                className={`flex items-center gap-2 p-2  transition
                  ${
                    isLiked
                      ? " text-red-700 "
                      : " text-gray-800  hover:bg-red-200"
                  } disabled:opacity-50 `}
              >
                <ThumbsUp
                  className="w-5 h-5"
                  fill={isLiked ? "red" : "none"}
                  strokeWidth={1.5}
                />
               
              </button>

              <button
                onClick={handleLaterRead}
                disabled={isProcessing}
                className={`flex items-center text-white gap-2 px-4 py-2 rounded-lg transition
                  ${
                    isLaterRead
                      ? "bg-gray-100  border border-green-400 "
                      : "bg-secondary  hover:bg-gray-700 "
                  } disabled:opacity-50 shadow-sm`}
              >
                
                {isLaterRead ? "Remove" : "Later Read"}
              </button>

              <Link
                to={`/readbook/${book.bookId ? book.bookId : book._id}`}
                className="px-4 py-2 bg-secondary  text-white rounded hover:bg-gray-600"
              >
                Read Now
              </Link>
            </div>

            <div className="flex justify-center lg:justify-start mt-2 gap-1">
              {[1, 2, 3, 4, 5].map((value) => {
                const isFull = value <= averageRating;
                const isHalf = !isFull && value - 0.5 <= averageRating;
                return (
                  <Star
                    key={value}
                    className="w-6 h-6 cursor-pointer"
                    fill={
                      isFull ? "gold" : isHalf ? "url(#halfGradient)" : "white"
                    }
                    stroke="gold"
                    onClick={() => handleRating(value)}
                  />
                );
              })}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="halfGradient">
                    <stop offset="50%" stopColor="gold" />
                    <stop offset="50%" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="lg:w-2/3 overflow-y-auto max-h-[400px] px-1 sm:px-4">
            <h2 className="text-xl font-bold text-blue-700 mb-3">
              What's in the book?
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
