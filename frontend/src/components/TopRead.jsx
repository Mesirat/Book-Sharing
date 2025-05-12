import { useEffect, useState } from "react";
import api from "../Services/api";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";


const TopRead = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await api.get(`/books/topRead`,{
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });
        const topBooksData = response.data;
     
        setTopBooks(Array.isArray(topBooksData) ? topBooksData : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setTopBooks([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);
  const handleCardClick = (book) => {
    navigate(`/bookDetail`,{state:{book}});
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section className="w-full mx-auto p-4 md:p-10 mb-8 ">
      <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-sans">Top Read This Week</h1>
        <p className="text-lg mt-4 text-gray-600">
          This week’s most-read books are here! See what readers can’t put down.
        </p>
      </div>

      {topBooks.length === 0 ? (
        <p className="text-center">No top read books available this week.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {topBooks.map((book) => (
            <div
              key={book._id}
              className="flex bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-xl"
              onClick={() => handleCardClick(book)}
            >
              <div className="w-1/3">
                <img
                  src={book.thumbnail || "/default-cover.jpg"}
                  alt={book.title}
                  className="h-80 w-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                  <p className="text-sm mb-3">
                    Dive into the world of <strong>{book.title}</strong>.
                    Discover compelling stories, inspiring characters, and
                    insightful journeys.
                  </p>
         
                  <p className="text-sm italic text-gray-600">
                    Author:{" "}
                    {book.authors && book.authors.length > 0 ? book.authors.join(", ") : "Unknown"}

                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                <Link
                to={`/readbook/${book._id}`}
                className="px-4 py-2 bg-secondary  rounded hover:bg-gray-600"
              >
                Read Now
              </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopRead;
