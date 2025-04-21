import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/users";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setHistory(response.data.history);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Error fetching history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reading History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          history.map((book) => (
            <div key={book.bookId} className="border p-4 rounded-lg shadow-md">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="h-48 w-full object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-2">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
