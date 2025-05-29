import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  LogOut,
  UserRoundCog,
  UserPlus,
  ClipboardList,
  BookPlus,
  FileCog,
  Newspaper,
  Users,
  Menu,
  X,
} from "lucide-react";

const SideBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/admin", label: "Dashboard", Icon: LuLayoutDashboard },
    {
      to: "/admin/roleManagement",
      label: "User Management",
      Icon: UserRoundCog,
    },
    { to: "/admin/bookManagement", label: "Book Management", Icon: FileCog },
    { to: "/admin/groupManagement", label: "Group Management", Icon: Users },
    { to: "/admin/uploadBook", label: "Book Upload", Icon: BookPlus },
    { to: "/admin/addUsers", label: "Add Users", Icon: UserPlus },
    { to: "/admin/uploadBlog", label: "Blogs", Icon: Newspaper },
    { to: "/admin/report", label: "Support Center", Icon: ClipboardList },
    { to: "/logout", label: "Logout", Icon: LogOut },
  ];

  return (
    <>
      <div className="md:hidden p-4 bg-gray-800 text-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-800 text-white md:h-screen p-4 md:mr-4 fixed md:static z-50 top-0 left-0 h-full overflow-y-auto transition-transform duration-300`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6 hidden md:block">Admin Panel</h2>
        <ul>
          {navLinks.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to} className="p-2">
                <Link
                  to={to}
                  className={`block py-2 px-4 hover:bg-gray-700 rounded flex items-center transition-all duration-300 ${
                    isActive ? "bg-gray-600" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-6 h-6 mr-4" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
