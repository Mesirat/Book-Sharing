import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // Adjust path as needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
          📘 Bookish
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex space-x-12 text-gray-600 font-medium">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          {isAuthenticated ?(
             <Link to="/user" className="hover:text-blue-600">
             Dashboard
           </Link>
          ):("")}
         
          <Link to="/shop" className="hover:text-blue-600">
            Books
          </Link>
          <Link to="/blog" className="hover:text-blue-600">
            Categories
          </Link>
          <Link to="/page" className="hover:text-blue-600">
            About
          </Link>
         
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </nav>

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
                className="hidden md:inline-block text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            </>
          )}

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-2 px-6 py-4 text-gray-600 font-medium">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/shop" className="hover:text-blue-600">
              Books
            </Link>
            <Link to="/blog" className="hover:text-blue-600">
              Categories
            </Link>
            <Link to="/page" className="hover:text-blue-600">
              About
            </Link>
            <Link to="/user" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/contact" className="hover:text-blue-600">
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-blue-600">
                  Profile
                </Link>
                <Link to="/logout" className="hover:text-blue-600">
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600">
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;
