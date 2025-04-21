// import React from "react";
// import { useLocation } from "react-router-dom";
// import AuthorDetails from "../component/AuthorDetail";

// const BookDetail = () => {
//   const location = useLocation();
//   const { book } = location.state || {};

//   if (!book) {
//     return <div className="text-center text-gray-500 mt-10">No book data available.</div>;
//   }

//   const thumbnail =
//     book?.volumeInfo?.imageLinks?.smallThumbnail || "/assets/6.jpg";
//   const title = book?.volumeInfo?.title || "Untitled";
//   const authors = book?.volumeInfo?.authors || ["Unknown Author"];
//   const publisher = book?.volumeInfo?.publisher || "Unknown Publisher";
//   const publishYear = book?.volumeInfo?.publishedDate?.split("-")[0] || "N/A";
//   const description =
//     book?.volumeInfo?.description || "No description available.";
//   const previewLink = book?.volumeInfo?.previewLink || "#";

//   return (
//     <div className="bg-gray-100 flex justify-center items-center py-10 lg:mx-12">
//       <div className="bg-white p-6 md:w-full mx-4 sm:mx-6 lg:mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 uppercase text-center mb-6">
//           {title}
//         </h1>

//         <div className="flex flex-col lg:flex-row bg-white p-4 rounded-lg shadow-md">
//           <div className="flex justify-center lg:justify-start mb-6 lg:mb-0 lg:w-1/3">
//             <img
//               src={thumbnail}
//               alt={title}
//               className="w-100 h-auto object-cover rounded-lg"
//             />
//           </div>

//           <div className="lg:w-2/3 lg:pl-8">
//             <p className="text-xl font-bold text-blue-700 mb-4">What's in the book?</p>
//             <p className="text-gray-700 leading-relaxed">{description}</p>
//             <p className="text-gray-500 mt-4">
//               <strong>Published by:</strong> {publisher}, {publishYear}
//             </p>
//             <p className="text-gray-600 font-bold mt-2 cursor-pointer">
//               By {authors.join(", ")}
//             </p>
//           </div>
//         </div>

//         {/* Pass the first author to AuthorDetails */}
//         <AuthorDetails authorName={authors[0]} />

//         <div className="text-center mt-6">
//           <a
//             href={previewLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
//           >
//             Preview Book
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookDetail;
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthorDetails from "../components/AuthorDetail";
import axios from "axios";
import { Check, ThumbsUp, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API_URL = "http://localhost:5000/users"; 
const RATING_API_URL = "http://localhost:5000/books"; 

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

  // Ensure that the book object is defined before proceeding
  if (!book) {
    return <div className="text-center text-gray-500 mt-10">No book data available.</div>;
  }

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedBooks")) || [];
    const savedLaterReads = JSON.parse(localStorage.getItem("laterReads")) || [];
    setLikedBooks(savedLikes);
    setLaterReads(savedLaterReads);

    const fetchRatings = async () => {
      try {
        const response = await axios.get(`${RATING_API_URL}/${book.id}/ratings`);
        setAverageRating(response.data.averageRating);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book ratings:", error.message);
        setLoading(false);
      }
    };

    if (book) fetchRatings();
  }, [book]); // Depend on the `book` object, so it re-fetches when the book changes

  const handleAction = async (action, book, endpoint, stateSetter, localKey) => {
    setIsProcessing(true);
    try {
      const response = await axios.put(
        `${API_URL}/${endpoint}`,
        {
          bookId: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
          thumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "/assets/6.jpg",
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
      console.error(`Error performing ${action}:`, error.response ? error.response.data : error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = (book) => {
    handleAction("likedBooks", book, "likeBook", setLikedBooks, "likedBooks");
  };

  const handleLaterRead = (book) => {
    handleAction("laterReads", book, "laterRead", setLaterReads, "laterReads");
  };

  const handleReadNow = (book) => {
    window.open(book.volumeInfo.previewLink, "_blank");
  };

  const handleRating = async (rating, book) => {
    try {
      await axios.post(
        `${RATING_API_URL}/rate`,
        {
          volumeId: book.id,
          userId: user._id, 
          rating,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      setUserRating(rating);

      const response = await axios.get(`${RATING_API_URL}/${book.id}/ratings`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    }
  };

  const thumbnail = book?.volumeInfo?.imageLinks?.smallThumbnail || "/assets/6.jpg";
  const title = book?.volumeInfo?.title || "Untitled";
  const authors = book?.volumeInfo?.authors?.join(", ") || "Unknown Author";
  const publisher = book?.volumeInfo?.publisher || "Unknown Publisher";
  const publishYear = book?.volumeInfo?.publishedDate?.split("-")[0] || "N/A";
  const description = book?.volumeInfo?.description || "No description available.";

  const isLiked = likedBooks.some((likedBook) => likedBook.bookId === book.id);
  const isLaterRead = laterReads.some((laterRead) => laterRead.bookId === book.id);

  return (
    <div className="bg-gray-100 flex justify-center items-center py-10 px-12">
      <div className="p-1 md:w-full mx-4 sm:mx-6 lg:mx-auto">
        <div className="py-4 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black text-center mb-5">{title}</h1>

          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col items-center mb-6 lg:mb-0 lg:w-1/3">
              <img
                src={thumbnail}
                alt={title}
                className="w-full sm:w-64 lg:w-80 h-104 object-cover items-center rounded-lg shadow-lg shadow-gray-500 mb-2"
              />
              <p className="text-gray-500 mt-4">
                <strong>Published by:</strong> {publisher}, {publishYear}
              </p>
              <p className="font-serif text-gray-600 mt-2 cursor-pointer">
                By <span className="underline font-bold">{authors}</span>
              </p>

              <div className="mt-3 flex gap-3 justify-center w-full">
                <div className="flex flex-col items-center">
                  <p className="font-bold">Average Rating:</p>
                  <p>{averageRating}</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className="w-6 h-6 cursor-pointer"
                        fill={value <= (userRating || averageRating) ? "gold" : "white"}
                        onClick={() => handleRating(value, book)}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLike(book)}
                  disabled={isProcessing}
                  className="px-1 py-1 text-black rounded-md focus:outline-none"
                >
                  <ThumbsUp
                    className="w-6 h-6"
                    color="black"
                    fill={isLiked ? "red" : "white"}
                    strokeWidth={1}
                  />
                </button>

                <button
                  onClick={() => handleLaterRead(book)}
                  disabled={isLaterRead || isProcessing}
                  className={`flex items-center px-1 py-1 text-sm ${
                    isLaterRead ? "bg-blue-300 text-green-800 font-semibold cursor-not-allowed" : "bg-blue-900 text-white"
                  } rounded-md focus:outline-none ml-1`}
                >
                  {isLaterRead ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    "Later Read"
                  )}
                </button>

                <button
                  onClick={() => handleReadNow(book)}
                  className="px-1 py-1 text-sm rounded-md bg-blue-900 text-white focus:outline-none ml-1"
                >
                  Read Now
                </button>
              </div>
            </div>

            <div className="lg:w-2/3 lg:pl-8 md:overflow-y-auto md:max-h-[50vh] p-5 rounded-md shadow-md shadow-gray-500 sm:overflow-y-auto sm:max-h-[50vh]">
              <p className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">What's in the book?</p>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>

        <hr className="text-gray-800" />
        <AuthorDetails authorName={authors} />
      </div>
    </div>
  );
};

export default BookDetail;
