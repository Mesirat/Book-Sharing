import React, { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/headers/bars/NavBar";
import SideBar from "../components/headers/bars/SideBar";

import { useAuthStore } from "../store/authStore";

import Footer from "../components/Footer.jsx";
import TopRead from "../components/TopRead.jsx";
import Categories from "../components/Categories.jsx";
import MostLikedBooks from "../components/MostLikedBooks.jsx";
import ReportButton from "../components/ReportButton.jsx";
import Recommendation from "./User/Recommendation.jsx";

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <SideBar />
      <Navbar />

      <main className="flex-grow">
        <section className="w-full bg-gray-80 text-text flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-12">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <div className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <h1>
                The World <br />
                Belongs to <br />
                Those Who Read
              </h1>
            </div>
            <p className="text-lg font-semibold mb-4">
              A platform for students to find great reads and recommend them to
              others.
            </p>
            <p className="text-sm mt-2 text-gray-600">
              Join 1,200+ students sharing over 5,000 books.
            </p>
            <Link
              to="/login"
              className="mt-6 bg-secondary hover:bg-gray-400 text-lg font-medium px-8 py-3 rounded-lg shadow-md transition duration-300"
            >
              Join Us
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
            <img
              src="/assets/home.png"
              alt="Illustration of student reading books online"
              className="w-full max-w-md md:max-w-lg object-contain"
            />
          </div>
        </section>

        <section className="w-full bg-white items-center px-6 md:px-20 mt-24 mb-12">
          {isAuthenticated && (
            <>
              <TopRead />
              <Categories />
              <MostLikedBooks />
              <Recommendation user={user} />
            </>
          )}
        </section>
        <ReportButton />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
