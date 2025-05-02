import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuLayoutDashboard } from 'react-icons/lu'; // Example import, replace with your actual icon imports
import { CircleUserRound, LogOut, Upload, Settings } from 'lucide-react'; // Example imports

const SideBar = () => {
  const location = useLocation(); // Get the current location (for active link)
  
  const navLinks = [
    { to: "/admin", label: "Dashboard", Icon: LuLayoutDashboard },
    { to: "/admin/roleManagement", label: "User Management", Icon: CircleUserRound },
    { to: "/admin/bookManagement", label: "Book Management", Icon: Settings },
    { to: "/admin/uploadBook", label: "Book Upload", Icon: Upload },
    { to: "/admin/addUsers", label: "Add Users", Icon: Upload },
    { to: "/admin/report", label: "User Reports", Icon: Settings },
    { to: "/admin/settings", label: "Settings", Icon: Settings },
    { to: "/logout", label: "Logout", Icon: LogOut },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul>
        {navLinks.map(({ to, label, Icon }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to} className="p-2">
              <Link 
                to={to} 
                className={`block py-2 px-4 hover:bg-secondary rounded flex items-center transition-all duration-300 ${
                  isActive ? "bg-button" : ""
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
