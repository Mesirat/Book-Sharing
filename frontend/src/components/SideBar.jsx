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
  BookOpenText,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import { useSelector } from "react-redux";
const SideBar = ({ setIsOpen, IsOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navLinks = [
    { to: "/user", label: "Dashboard", Icon: LuLayoutDashboard },
    { to: "/user/history", label: "History", Icon: History },
    { to: "/user/later", label: "Read Later", Icon: Clock3 },
    { to: "/user/liked", label: "Liked Books", Icon: BookHeart },
    { to: "/user/chat", label: "Groups", Icon: MessageSquareMore },
    { to: "/user/profile", label: "Account", Icon: CircleUserRound },
    { to: "/logout", label: "Log Out", Icon: LogOut },
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
      document.body.style.overflow = "hidden"; // prevent background scroll
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [expanded]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
          expanded ? "w-46 bg-gray-300" : "w-6"
        }`}
      >
        <div className="flex justify-between items-center px-4 mt-4 menu-container w-full">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 text-black"
            aria-expanded={expanded}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className={`flex items-center ml-2 `}>
            <BookOpenText className="w-6 h-6 m-1" />
            <h2 className="font-bold text-2xl sm:text-xl text-black">
              Bookish
            </h2>
          </div>
        </div>
        <div className="mt-8 px-2 space-y-4 m-1">
          {navLinks.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to;
            const IconComponent = Icon;
            return (
              <div
                key={to}
                className={`p-2 relative ${
                  expanded ? "hover:bg-gray-300 rounded-md" : ""
                } ${isActive ? "bg-blue-500 text-black" : ""}`}
              >
                <Link
                  to={to}
                  className={`flex items-center p-2 transition-all duration-300 ${
                    expanded
                      ? "hover:bg-gray-800 hover:text-white rounded-md px-2"
                      : ""
                  } ${isActive ? "bg-amber-500 rounded-md shadow-md" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setExpanded(false)}
                >
                  <div className="relative group">
                    <IconComponent className="w-6 h-6" />
                    {!expanded && (
                      <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-black text-white whitespace-nowrap text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-50 pointer-events-none">
                        {label}
                      </div>
                    )}
                  </div>
                  <span
                    className={`${
                      expanded ? "block ml-4" : "hidden"
                    } transition-all duration-300`}
                  >
                    {label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
      {expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default SideBar;
