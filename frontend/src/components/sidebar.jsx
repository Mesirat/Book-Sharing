import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Menu,
  MessageSquareMore,
  CircleUserRound,
  History,
  Clock3,
  BookHeart,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import { useAuthStore } from "../store/authStore";

const SideBar = ({ onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const menuLinks = [
    { to: '/user', label: `${user.name}'s DashBoard`, icon: <LuLayoutDashboard size={24} /> },
    { to: '/user/history', label: "History", icon: <History size={24} /> },
    { to: '/user/later', label: "Read Later", icon: <Clock3 size={24} /> },
    { to: '/user/liked', label: "Liked Books", icon: <BookHeart size={24} /> },
    { to: '/user/chat', label: "Groups", icon: <MessageSquareMore size={24} /> },
    { to: '/user/profile', label: "Account", icon: <CircleUserRound size={24} /> },
    { to: '/logout', label: "Log Out", icon: <LogOut size={24} /> },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".menu-container")) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  return (
    <div className="flex bg-gray-800">
      <div className="menu-container">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="fixed top-4 left-4 z-50 text-white p-2 mb-4 flex"
          aria-expanded={expanded}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <nav
          className={`fixed inset-y-0 left-0 transform transition-transform duration-300 z-40 mt-12 ml-0 ${
            expanded ? "translate-x-0 w-64 bg-gray-600" : "translate-x-full w-16"
          }`}
          role="navigation"
        >
          <div className="flex flex-col left-0 items-start py-6 space-y-2">
            {menuLinks.map((link) => (
              <div key={link.to} className="relative group">
                <Link
                  to={link.to}
                  className={`flex items-center px-6 py-2 text-white transition-all duration-300 ${
                    expanded ? "hover:bg-gray-800 hover:text-white" : ""
                  } ${location.pathname === link.to ? "bg-amber-500" : ""}`}
                  aria-current={location.pathname === link.to ? "page" : undefined}
                  onClick={() => setExpanded(false)}
                >
                  <div className="flex font-bold font-serif items-center gap-6">
                    {link.icon}
                    <span className={`${expanded ? "block" : "hidden"} transition-all duration-300`}>
                      {link.label}
                    </span>
                  </div>
                </Link>

                <div
                  className={`absolute left-14 bottom-0 text-center mb-1 bg-black text-white w-[100px] text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    expanded ? "hidden" : "block"
                  }`}
                >
                  {link.label}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className={`transition-all duration-300 ${expanded ? "ml-64" : "ml-4"}`}></div>
    </div>
  );
};

export default SideBar;
