import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  CircleUserRound,
  LogOut,
  Upload,
  Settings,
  UserRoundCog,
  UserPlus,
  ClipboardList,
  BookPlus,
  FileCog,
  Newspaper,
  Users,
} from "lucide-react"; 

const SideBar = () => {
  const location = useLocation(); 

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
    { to: "/admin/uploadBlog", label: "Anouncement", Icon: Newspaper },
    { to: "/admin/report", label: "User Reports", Icon: ClipboardList },
    
    { to: "/logout", label: "Logout", Icon: LogOut },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4 mr-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul>
        {navLinks.map(({ to, label, Icon }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to} className="p-2">
              <Link
                to={to}
                className={`block py-2 px-4 hover:bg-gray-400 rounded flex items-center transition-all duration-300 ${
                  isActive ? "bg-secondary" : ""
                }`}
              >
                <Icon className="w-6 h-6 mr-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
