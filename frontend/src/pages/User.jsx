import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import Cards from "../../component/Cards";
import SideBar from "../../component/SideBar";
import { Loader } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Recommendation from "./Recommendation";

const User = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarClicked, setIsSidebarClicked] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  const searchBooks = async () => {
    if (query.trim() !== "") {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/books/search", {
          params: { query },
        });
        setBooks(response.data.items);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a valid query.");
    }
  };

  const searchBox = (e) => {
    if (e.key === "Enter") {
      searchBooks();
    }
  };

  const handleSidebarClick = () => {
    setIsSidebarClicked(true);
  };

  const resetSidebarState = () => {
    setIsSidebarClicked(false);
  };

  useEffect(() => {
   
    if (location.pathname === "/user") {
      resetSidebarState();
    } else {
     
      setIsSidebarClicked(false);
    }
  }, [location.pathname]);

  return (
    <div className="font-sans relative min-h-screen bg-customLight flex">
      <SideBar onClick={handleSidebarClick} />

      <div className="flex-1 py-6 px-4">
        {!isSidebarClicked && location.pathname !== "/user" && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-3/4 md:w-1/2 lg:w-1/3">
              <input
                type="text"
                className="w-full px-3 py-2 outline-none"
                placeholder="What do you want to read?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={searchBox}
              />
              <button className="text-black p-2" onClick={searchBooks}>
                <IoSearchOutline className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {loading && <Loader className="animate-spin mx-auto my-4" />}
        {error && <div className="text-red-500 text-center my-4">{error}</div>}

        <Cards books={books} />

        <Outlet />
      </div>
    </div>
  );
};

export default User;
