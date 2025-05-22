import React, { useState, useEffect } from "react";
import api from "../../Services/api.js";
import Cards from "../../components/Cards.jsx";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

const Recommendation = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchHybridRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/recommendation/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to load recommendations. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchHybridRecommendations();
  }, [user]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid min-h-screen w-full justify-center items-center overflow-hidden px-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">Loading recommendations...</p>
        </div>
      ) : (
        <>
          <div className="text-start mb-6">
            <h1 className="text-4xl md:text-5xl font-sans">Suggested Reads</h1>
            <p className="text-lg mt-4 text-gray-600">
              Handpicked selections just for you, inspired by your reading tastes
            </p>
          </div>

          <Cards books={books} />
        </>
      )}
    </div>
  );
};

export default Recommendation;
