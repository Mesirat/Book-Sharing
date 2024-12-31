import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlignJustify,
  BookHeart,
  BookMarked,
  CircleUserRound,
  Clock,
  History,
  House,
  MessageSquareMore
} from "lucide-react";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
    <>
      <nav className="fixed h-full  text-white z-12 px-1 ">
        <div className="flex  px-2 mt-4 space-x-4 ">
          <button onClick={toggleMenu} className="lg:hidden">
            <AlignJustify className="w-6 h-6 text-black" />
          </button>
          <div className="">
            <h2 className="font-serif text-3xl text-black">Bookish</h2>
          </div>
        </div>
        <div
          className={`mt-4 ${
            isOpen ? "w-full" : "w-12 items-center"
          }  bg-gray-900 h-full rounded-md trasition-all duration-10 ease-in-out top-0 left-0 `}
        >
          <ul className="space-y-4 font-sans px-1">
            {navLinks.map(({ to, label, Icon }) => (
              <li key={to}
                className={`${
                  isOpen ? "hover:bg-white hover:text-black rounded-md" : ""
                } p-2`}
              >
                <Link  to={to} className="flex items-center space-x-4">
                  <Icon className="w-6 h-6" />
                  {isOpen && <span className="font-semibold">{label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
