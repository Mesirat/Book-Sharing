import React from "react";
import { Link, useLocation } from "react-router-dom";
import { House, MessageSquareMore, BookMarked, Clock, History, BookHeart, CircleUserRound, BookOpenText } from "lucide-react";

function SideBar({ IsOpen, setIsOpen }) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", Icon: House },
    { to: "/chat", label: "Chat", Icon: MessageSquareMore },
    { to: "/savedbooks", label: "Saved Books", Icon: BookMarked },
    { to: "/readlater", label: "Read later", Icon: Clock },
    { to: "/history", label: "History", Icon: History },
    { to: "/likedbooks", label: "Liked Books", Icon: BookHeart },
    { to: "/profile", label: "Profile", Icon: CircleUserRound },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-gray-100 z-10 transition-all duration-300 ease-in-out transform ${
        IsOpen ? "w-48 opacity-100" : "w-16 opacity-100"
      }`}
    >
      <div className="flex justify-between items-center px-4 mt-4">
        <button onClick={() => setIsOpen(!IsOpen)} className="p-2 text-black">
          <span className="text-2xl">☰</span>
        </button>
        <div className="flex cursor-pointer items-center ml-2">
          <BookOpenText className="w-6 h-6 m-1" />
          <h2 className={`font-bold text-2xl text-black `}>Bookish</h2>
        </div>
      </div>

      <ul className="mt-8 px-2 space-y-4 m-1">
        {navLinks.map(({ to, label, Icon }) => (
          <li
            key={to}
            className={`group p-2 relative ${
              IsOpen ? "hover:bg-gray-300 hover:text-black rounded-md" : ""
            } ${location.pathname === to ? "bg-blue-500 text-black" : ""}`} 
          >
            <Link to={to} className="flex items-center space-x-4">
              <Icon className="w-6 h-6" />
              {IsOpen && <span>{label}</span>}
            </Link>
            {!IsOpen && (
              <div
                className="absolute bg-gray-900 text-white text-sm rounded-md py-1 px-2 left-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ whiteSpace: "nowrap" }}
              >
                {label}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideBar;
