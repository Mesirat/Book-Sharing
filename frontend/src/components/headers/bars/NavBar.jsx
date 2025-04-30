import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  ShoppingCart,
  BookOpenText,
  LogIn,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
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
      <div className="max-w-7xl mx-auto  sm:px-6 py-2 flex items-center justify-between">
        <Link to="/" className="hidden xl:flex items-center space-x-2 z-50 ">
          <BookOpenText className="w-6 h-6" />
          <span className="font-bold text-2xl text-gray-700">Bookish</span>
        </Link>

        <div className="flex items-center w-full max-w-2xl mx-12 border border-gray-300 rounded-full  p-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="What do you want to read?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={searchBox}
            className="w-full outline-none border-none  px-2 bg-transparent"
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
          <>
          
            <Link
              to="/login"
              className="hidden lg:flex text-sm px-3 py-1 bg-button text-text rounded transition duration-300
               transform hover:scale-105"
            >
              Sign In
            </Link>
             <Link
             to="/login"
             className="flex lg:hidden text-sm px-3 py-1  rounded hover:bg-button"
           >
             <LogIn />
           </Link>
          </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
