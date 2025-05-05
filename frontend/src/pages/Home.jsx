import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/headers/bars/NavBar";
import SideBar from "../components/headers/bars/SideBar";
import GroupList from "../components/chat/GroupList.jsx";
import GroupCreate from "../components/chat/GroupCreate.jsx";
import { useAuthStore } from "../store/authStore";
import { bookCategories } from "./utils/data.js";

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  return (
    <>
      <div className="h-screen">
        <SideBar />
        <Navbar />

        {/* Hero Section */}
        <section className="h-full w-full bg-gray-80 text-text flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mb-12">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <div className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <h1>
                The World <br />
                Belongs to <br />
                Those Who Read
              </h1>
            </div>
            <p className="text-lg font-semibold mb-4">
              A platform for students to find great reads and recommend them to others.
            </p>
            <p className="text-sm mt-2 text-gray-600">
              Join 1,200+ students sharing over 5,000 books.
            </p>
            <Link
              to="/signup"
              className="mt-6 bg-secondary hover:bg-gray-400 text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300"
            >
              Join Us
            </Link>
          </div>

          <div className="w-full md:w-1/2 h-full flex items-center justify-center">
            <img
              src="/assets/home.png" // Ensure the image is placed in the public/assets folder
              alt="Illustration of student reading books online"
              className="w-full max-w-md md:max-w-lg object-contain"
            />
          </div>
        </section>

        {/* Featured Categories */}
        <section className="h-full w-full items-center px-6 md:px-20 mb-12">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-sans">Featured Categories</h1>
            <div className="flex flex-col md:flex-row items-center justify-between mt-6">
              <div className="text-xl mb-4 md:mb-0">
                <h1 className="mb-1">
                  Go on fun trips to the future! Discover new worlds, learn how things work, and
                </h1>
                <h1>Explore amazing places in space with these exciting stories.</h1>
              </div>
              <div className="flex bg-secondary hover:bg-gray-500 flex-row items-center justify-center mx-2 rounded-lg shadow-md transition duration-300 px-8 py-2">
                <Link to="/category" className="text-lg font-medium">
                  All Categories
                </Link>
                <ArrowRight className="ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-6">
              {Object.entries(bookCategories)
                .slice(0, 4)
                .map(([parent, subcategories]) => (
                  <div
                    key={parent}
                    className="flex flex-col items-center rounded-2xl p-4 transition-transform duration-300 cursor-pointer"
                  >
                    <div className="w-full overflow-hidden h-80 rounded-md">
                      {subcategories.map((subcategory, index) => (
                        <img
                          key={index}
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                          src={subcategory}
                          alt={`${parent} thumbnail ${index + 1}`}
                        />
                      ))}
                    </div>
                    <h2 className="text-xl sm:text-2xl my-2">{parent}</h2>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Read This Week */}
          <div className="mt-24 p-4">
            <div className="mb-16 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-sans">Top Read This Week</h1>
              <div className="text-xl mt-6 mb-4 md:mb-0">
                <h1 className="mb-1">This week’s most-read books are here! See what readers can’t put down.</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              {Object.entries(bookCategories)
                .slice(0, 2)
                .map(([parent, subcategories]) => (
                  <div
                    key={parent}
                    className="flex bg-white overflow-hidden transition-transform duration-300"
                  >
                    <div className="w-1/3">
                      <img
                        src={subcategories[0]}
                        alt={`${parent} thumbnail`}
                        className="h-80 w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{parent}</h2>
                        <p className="text-sm mb-3">
                          Dive into a fascinating world of <span className="font-medium">{parent}</span> books.
                          Discover compelling stories, inspiring characters, and insightful journeys.
                        </p>
                        <p className="text-sm italic">Author: Unknown</p>
                      </div>
                      <div className="mt-4">
                        <button className="px-4 py-2 bg-secondary hover:bg-gray-400 text-sm font-medium rounded-lg">
                          Read Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Featured Books */}
          <div className="mt-24 p-4">
            <div className="mb-16 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-sans">Featured Books</h1>
              <div className="text-xl mt-6 mb-4 md:mb-0">
                <h1 className="mb-1">
                  Explore amazing stories from famous authors in this captivating collection.
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-6">
              {Object.entries(bookCategories).map(([parent, subcategories]) => (
                <div
                  key={parent}
                  className="flex flex-col items-center p-4 transition-transform duration-300 bg-white cursor-pointer"
                >
                  <div className="flex flex-wrap gap-2 justify-center">
                    {subcategories.map((subcategory, index) => (
                      <div key={index} className="w-full h-80 overflow-hidden rounded-md">
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                          src={subcategory}
                          alt={`${parent} thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-2xl my-2">{parent}</h2>
                </div>
              ))}
            </div>

            {/* Group List (Only if Logged In) */}
            {isAuthenticated && (
              <div>
                {/* Optional Group Create Modal */}
                {/* <button onClick={() => setShowCreateGroupModal(true)}>Create Group</button>
                {showCreateGroupModal && (
                  <GroupCreate onClose={() => setShowCreateGroupModal(false)} />
                )} */}
                <GroupList />
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
