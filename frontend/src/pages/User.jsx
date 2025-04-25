import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../components/Cards";
import SideBar from "../components/SideBar";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { Loader } from "lucide-react";

const User = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarClicked, setIsSidebarClicked] = useState(false);

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

  const handleSidebarClick = () => {
    setIsSidebarClicked(true);
  };

  const resetSidebarState = () => {
    setIsSidebarClicked(false);
  };

  return (
    <>
      <Navbar />
      <div className="font-sans relative min-h-screen bg-customLight flex">
        <SideBar onClick={handleSidebarClick} />

        <div className="flex-1 py-6 px-4 ml-20 md:ml-12 lg:ml-8">
          {!isSidebarClicked && location.pathname === "/user" && (
            <div className="flex justify-center mb-4">
              <Cards books={books} />
            </div>
          )}

          {loading && <Loader className="mx-auto w-6 h-6 animate-spin"/>}
          {error && (
            <div className="text-red-500 text-center my-12">{error}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default User;
