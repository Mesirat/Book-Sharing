import { useState, useEffect } from "react";
import {Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Check, ThumbsUp, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API_URL = "http://localhost:5000/books";

const BookDetail = () => {
  const location = useLocation();
  const { book } = location.state || {};
  const { user } = useAuthStore();

  const [likedBooks, setLikedBooks] = useState([]);
  const [laterReads, setLaterReads] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get(`${API_URL}/${book.id}/ratings`);
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
      const response = await axios.put(
        `${API_URL}/${endpoint}`,
        {
          bookId: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
          thumbnail:
            book.volumeInfo.imageLinks?.smallThumbnail || "/assets/6.jpg",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

  const handleReadNow = () => {
    window.open(book.volumeInfo.previewLink, "_blank");
  };

  const handleRating = async (rating) => {
    try {
      await axios.post(
        `${API_URL}/rate`,
        {
          volumeId: book.id,
          userId: user._id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUserRating(rating);

      const response = await axios.get(`${RATING_API_URL}/${book.id}/ratings`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    }
  };

  const thumbnail =
    book.volumeInfo.imageLinks?.smallThumbnail || "/assets/6.jpg";
  const title = book.volumeInfo.title || "Untitled";
  const authors = book.volumeInfo.authors?.join(", ") || "Unknown Author";
  const publisher = book.volumeInfo.publisher || "Unknown Publisher";
  const publishYear = book.volumeInfo.publishedDate?.split("-")[0] || "N/A";
  const description =
    book.volumeInfo.description || "No description available.";

  const isLiked = likedBooks.some((likedBook) => likedBook.bookId === book.id);
  const isLaterRead = laterReads.some(
    (laterRead) => laterRead.bookId === book.id
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
              <strong>Published:</strong> {publisher}, {publishYear}
            </p>
            <p className="text-gray-700 italic text-center lg:text-left">
              By <span className="font-semibold underline">{authors}</span>
            </p>

            <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start w-full">
              <button
                onClick={handleLike}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
                  ${
                    isLiked
                      ? "bg-red-100 text-red-700 border border-red-400"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-red-200"
                  } disabled:opacity-50 shadow-sm`}
              >
                <ThumbsUp
                  className="w-5 h-5"
                  fill={isLiked ? "red" : "none"}
                  strokeWidth={1.5}
                />
                {isLiked ? "Liked" : "Like"}
              </button>

              <button
                onClick={handleLaterRead}
                disabled={isLaterRead || isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
                  ${
                    isLaterRead
                      ? "bg-green-100 text-green-700 border border-green-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-50 shadow-sm`}
              >
                {isLaterRead && <Check className="w-4 h-4" />}
                {isLaterRead ? "Added" : "Later Read"}
              </button>

              <Link
                to={`/readbook/${book.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Read Now
              </Link>
            </div>

            <div className="mt-4 w-full">
              <p className="font-semibold text-center lg:text-left">
                Average Rating: {averageRating.toFixed(1)}
              </p>
              <div className="flex justify-center lg:justify-start mt-2 gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className="w-6 h-6 cursor-pointer"
                    fill={
                      value <= (userRating || averageRating) ? "gold" : "white"
                    }
                    onClick={() => handleRating(value)}
                  />
                ))}
              </div>
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
