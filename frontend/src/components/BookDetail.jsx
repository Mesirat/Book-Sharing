import React from "react";
import { useLocation } from "react-router-dom";
import AuthorDetails from "../component/AuthorDetail";

const BookDetail = () => {
  const location = useLocation();
  const { book } = location.state || {};

  if (!book) {
    return <div className="text-center text-gray-500 mt-10">No book data available.</div>;
  }

  const thumbnail =
    book?.volumeInfo?.imageLinks?.smallThumbnail || "/assets/6.jpg";
  const title = book?.volumeInfo?.title || "Untitled";
  const authors = book?.volumeInfo?.authors || ["Unknown Author"];
  const publisher = book?.volumeInfo?.publisher || "Unknown Publisher";
  const publishYear = book?.volumeInfo?.publishedDate?.split("-")[0] || "N/A";
  const description =
    book?.volumeInfo?.description || "No description available.";
  const previewLink = book?.volumeInfo?.previewLink || "#";

  return (
    <div className="bg-gray-100 flex justify-center items-center py-10 lg:mx-12">
      <div className="bg-white p-6 md:w-full mx-4 sm:mx-6 lg:mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 uppercase text-center mb-6">
          {title}
        </h1>

        <div className="flex flex-col lg:flex-row bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-center lg:justify-start mb-6 lg:mb-0 lg:w-1/3">
            <img
              src={thumbnail}
              alt={title}
              className="w-100 h-auto object-cover rounded-lg"
            />
          </div>

          <div className="lg:w-2/3 lg:pl-8">
            <p className="text-xl font-bold text-blue-700 mb-4">What's in the book?</p>
            <p className="text-gray-700 leading-relaxed">{description}</p>
            <p className="text-gray-500 mt-4">
              <strong>Published by:</strong> {publisher}, {publishYear}
            </p>
            <p className="text-gray-600 font-bold mt-2 cursor-pointer">
              By {authors.join(", ")}
            </p>
          </div>
        </div>

        {/* Pass the first author to AuthorDetails */}
        <AuthorDetails authorName={authors[0]} />

        <div className="text-center mt-6">
          <a
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
          >
            Preview Book
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
