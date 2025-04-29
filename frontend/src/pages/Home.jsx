import React from "react";
import Navbar from "../components/headers/bars/NavBar";
import { ArrowRight } from "lucide-react";
import { bookCategories } from "../data";
import { Link } from "react-router-dom";
import SideBar from "../components/headers/bars/SideBar";
import GroupList from "../components/chat/GroupList.jsx";
import GroupCreate from "../components/chat/GroupCreate.jsx";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
const Home = () => {
  const { isAuthenticated,user } = useAuthStore();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  return (
    <>
      <div className="h-screen">
        <SideBar/>
        <Navbar />
        <section className="h-full w-full bg-gray-80 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mb-12">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <div className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">
              <h1 className="mb-6">The World </h1>
              <h1 className="mb-6">Belongs to</h1>
              <h1 className="mb-6">Those Who Read</h1>
            </div>

            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300"
            >
              Join Us
            </Link>
          </div>

          <div className="w-full md:w-1/2 h-full flex items-center justify-center">
            <img
              src="./assets/home.png"
              alt="Books hero"
              className="w-full max-w-md md:max-w-lg object-contain"
            />
          </div>
        </section>

        <section className="h-full w-full items-center px-6 md:px-20 mb-12">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-sans text-black">
              Featured Categories
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-between mt-6">
              <div className="text-xl text-gray-600 mb-4 md:mb-0">
                <h1 className="mb-1">
                  Go on fun trips to the future! Discover new worlds, learn how
                  things work, and{" "}
                </h1>
                <h1>
                  Explore amazing places in space with these exciting stories.
                </h1>
              </div>
              <div className="flex bg-blue-600 hover:bg-blue-700 flex-row items-center justify-center mx-2 rounded-lg shadow-md transition duration-300 px-8 py-2">
                <Link to="/category" className="text-white text-lg font-medium">
                  All Categories
                </Link>
                <ArrowRight className="text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mt-6">
              {Object.entries(bookCategories)
                .slice(0, 5)
                .map(([parent, subcategories]) => (
                  <div
                    key={parent}
                    className="flex flex-col items-center rounded-2xl p-4 transition-transform duration-300 shadow-lg shadow-gray-200 bg-white cursor-pointer"
                  >
                    <div className="flex flex-wrap gap-1 justify-center py-2">
                      {subcategories.map((subcategory, index) => (
                        <img
                          key={index}
                          className="w-full h-32 object-cover rounded-md my-2"
                          src={subcategory}
                          alt={`${parent} thumbnail ${index + 1}`}
                        />
                      ))}
                    </div>
                    <h2 className="text-black text-xl sm:text-2xl my-2">
                      {parent}
                    </h2>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-24 p-4">
            <div className="mb-16 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-sans text-black">
                Top Read This Week
              </h1>
              <div className="text-xl text-gray-600 mt-6 mb-4 md:mb-0">
                <h1 className="mb-1">
                  This week’s most-read books are here! See what readers can’t
                  put down.{" "}
                </h1>
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          {parent}
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">
                          Dive into a fascinating world of{" "}
                          <span className="font-medium">{parent}</span> books.
                          Discover compelling stories, inspiring characters, and
                          insightful journeys.
                        </p>
                        <p className="text-sm text-gray-500 italic">
                          Author: Unknown
                        </p>
                      </div>

                      <div className="mt-4">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                          Read Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-24 p-4">
            <div className="mb-16 flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-sans text-black">
                Featured Books
              </h1>
              <div className="text-xl text-gray-600 mt-6 mb-4 md:mb-0">
                <h1 className="mb-1">
                  Explore amazing stories from famous authors in this
                  captivating collection.{" "}
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
                      <div
                        key={index}
                        className="w-full h-80 overflow-hidden rounded-md"
                      >
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                          src={subcategory}
                          alt={`${parent} thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <h2 className="text-black text-xl sm:text-2xl lg:text-2xl my-2">
                    {parent}
                  </h2>
                </div>
              ))}
            </div>
            {isAuthenticated && (
              <div>
              {/* <button onClick={() => setShowCreateGroupModal(true)}>Create Group</button>
          
              {showCreateGroupModal && (
                <GroupCreate onClose={() => setShowCreateGroupModal(false)} />
              )} */}
             
            </div>
             ) }
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
