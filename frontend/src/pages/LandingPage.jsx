import React from "react";
import NavBar from "../components/NavBar"; // Assume you have a NavBar component
import Footer from "../components/Footer"; // Assume you have a Footer component

const LandingPage = () => {
  return (
    <div className="font-sans">
      {/* Header */}
      <NavBar />

      {/* Hero Section */}
      <div
        className="bg-[url('/assets/library.jpg')] bg-cover bg-center h-[100vh] flex flex-col items-center justify-center text-center px-4 sm:px-10"
        style={{ backgroundImage: "url('/assets/library.jpg')" }}
      >
        {/* Overlay */}
        <div className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl text-white">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Discover, Share, and Connect Through Books!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8">
            Join a community of book lovers. Share your favorite reads, find
            your next adventure, and connect with like-minded readers.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition">
              Get Started
            </button>
            <button className="bg-gray-100 text-black font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition">
              Find Your Next Read
            </button>
            <button className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
              Join a Book Club
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
            <p>
              Get book suggestions tailored to your taste based on your reading
              history and favorite genres.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Share and Exchange Books</h3>
            <p>
              Share your books with others and discover new reads through our
              vibrant community.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Join Book Clubs</h3>
            <p>
              Connect with like-minded readers and discuss your favorite books
              in groups and clubs.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Popular Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8">
          {/* Placeholder for book cards */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <img
              src="/assets/book1.jpg"
              alt="Book Title"
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold">Book Title</h3>
            <p className="text-sm text-gray-600">Author Name</p>
          </div>
          {/* Repeat similar cards or map dynamically */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>
              "This platform has transformed how I discover and read books! I
              love the recommendations!"
            </p>
            <h3 className="text-sm font-semibold mt-4">- Jane Doe</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>
              "Sharing books has never been easier. I've met so many great
              people through this community."
            </p>
            <h3 className="text-sm font-semibold mt-4">- John Smith</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>
              "The book clubs are fantastic! It's so fun to discuss books with
              others who share my interests."
            </p>
            <h3 className="text-sm font-semibold mt-4">- Alice Brown</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
