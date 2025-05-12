import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
import ReportButton from "./ReportButton";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 px-6 py-3 ">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Bookish</h2>
          <p className="mt-2 text-sm">
            Discover, share, and recommend your favorite reads with a community
            of book lovers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/user/likedbooks" className="hover:text-white">
                Explore Books
              </Link>
            </li>
            <li>
              <Link to="/user/chat" className="hover:text-white">
                Groups
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <ul className="space-y-2 mb-2">
            <li className="flex items-center space-x-2">
              <FaFacebook className="w-5 h-5" />
              <a href="https://facebook.com/login" className="hover:text-white">
                Facebook
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaTwitter className="w-5 h-5" />
              <a href="https://x.com/login?" className="hover:text-white">
                Twitter
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaGithub className="w-5 h-5" />
              <a href="https://github.com/login" className="hover:text-white">
                GitHub
              </a>
            </li>
          </ul>
          <p className="hover:text-white cursor-pointer">
            Email: support@bookish.com
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Bookish. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
