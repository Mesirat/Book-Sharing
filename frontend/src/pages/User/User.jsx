import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../../components/Cards";
import SideBar from "../../components/headers/bars/SideBar";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../../components/headers/bars/NavBar";
import { Loader } from "lucide-react";

const User = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query") || "";
    if (query.trim()) {
      searchBooks(query);
    }
  }, [searchParams]);

  const searchBooks = async (searchQuery) => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/books/search", {
          params: { query: searchQuery },
        });
        setBooks(response.data.items);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="font-sans relative min-h-screen bg-customLight flex">
        <SideBar />
        <div className={`flex-1 py-3 px-4   ${location.pathname=== "/user/chat" ? "ml-6": "ml-12 md:ml-16 lg:ml-16"}`}>
          {location.pathname === "/user" && (
            <Cards books={books} />
          )}

          {loading && <Loader className="animate-spin mx-auto my-4" />}
          {error && <div className="text-red-500 text-center my-12">{error}</div>}
          
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default User;
