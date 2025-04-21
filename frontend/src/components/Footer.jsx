import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-[#081b29] text-white py-6 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {/* Left Section - Links */}
          <div className="flex justify-center items-center space-x-6">
            <Link to="/about" className="hover:text-[#0ef]">About Us</Link>
            <Link to="/contact" className="hover:text-[#0ef]">Contact</Link>
            <Link to="/privacy" className="hover:text-[#0ef]">Privacy Policy</Link>
          </div>

          {/* Center Section - Social Icons */}
          <div className="flex justify-center items-center space-x-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#0ef]">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#0ef]">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#0ef]">
              <FaInstagram />
            </a>
          </div>

          {/* Right Section - Copyright */}
          <div className="text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
