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
  X,
  House,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";

const SideBar = ({ setIsOpen, IsOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", Icon: House },
    { to: "/user", label: "Dashboard", Icon: LuLayoutDashboard },
  
    { to: "/user/laterReads", label: "Read Later", Icon: Clock3 },
    { to: "/user/likedBooks", label: "Liked Books", Icon: BookHeart },
    { to: "/user/chat", label: "Group Chat", Icon: MessageSquareMore },
    { to: "/user/profile", label: "Account", Icon: CircleUserRound },
    { to: "/logout", label: "Log Out", Icon: LogOut },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 text-text left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
          expanded ? "w-56 bg-gray-300" : "w-6"
        } `}
      >
        <div className="flex  items-center px-4 mt-2 menu-container w-full">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 text-black"
            aria-expanded={expanded}
            aria-label="Toggle menu"
          >
            {expanded ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          {expanded && (
            <Link to="/" className=" flex items-center space-x-2 z-50 ml-8">
              <BookOpenText className="w-6 h-6" />
              <span className="font-bold text-2xl ">Bookish</span>
            </Link>
          )}
        </div>

        <div className={`mt-8 px-2 space-y-4 m-1 `}> 
          {navLinks.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to;
            const IconComponent = Icon;
            return (
              <div
                key={to}
                className={`p-2 relative ${
                  expanded ? "hover:bg-gray-300 rounded-md" : "hidden" 
                } ${isActive ? "" : ""}`}
              >
                <Link
                  to={to}
                  className={`flex items-center p-2 transition-all duration-3 ${
                    expanded
                      ? "hover:bg-gray-400  rounded-md px-2"
                      : ""
                  } ${
                    isActive && expanded
                      ? "bg-secondary rounded-md shadow-md"
                      : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setExpanded(false)}
                >
                  <div className="relative group">
                    <IconComponent className="w-6 h-6" />
                    {!expanded && (
                      <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-secondary  whitespace-nowrap text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-3 shadow-lg z-50 pointer-events-none">
                        {label}
                      </div>
                    )}
                  </div>
                  <span
                    className={`${
                      expanded ? "block ml-4" : "hidden"
                    } transition-all duration-3`}
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
          className="fixed inset-0 bg-red bg-opacity-50 z-40"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default SideBar;
