import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  ShoppingCart,
  BookOpenText,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchBooks = async () => {
    if (query.trim() !== "") {
      navigate(`/user?query=${query}`);
    } else {
      alert("Please enter a valid query.");
    }
  };

  const searchBox = (e) => {
    if (e.key === "Enter") {
      searchBooks();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
      
      <div className="">

      <Link
        to="/"
        className="hidden md:flex items-center space-x-2 z-50 "
      >
        <BookOpenText className="w-6 h-6" />
        <span className="font-bold text-2xl text-gray-700">Bookish</span>
      </Link>
  
      </div>
      
      <div className="flex items-center w-full max-w-2xl mx-12 border border-gray-300 rounded-full px-3 py-2">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="What do you want to read?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={searchBox}
          className="w-full outline-none border-none text-gray-600 px-2 bg-transparent"
        />
      </div>
  
 
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <Link to="/profile">
            <img
              src={user?.profileImage || "/default-avatar.jpg"}
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="hidden md:inline-block text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  </header>
  
  );
};

export default Navbar;
