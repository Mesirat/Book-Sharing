// import React, { useState } from "react";
// import { bookCategories } from "../utils/data";
// import api from "../Services/api";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import { useAuthStore } from "../store/authStore";

// const Categories = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
// const token = useAuthStore.getState().token;
//   const fetchBooks = async (category) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await api.get("/books/search", {
//         params: { category },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           withCredentials: true,
//         },
//       });

//       if (response.data?.items?.length > 0) {
//         setBooks(response.data.items);
//       } else {
//         setBooks([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch books. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     fetchBooks(category);
//   };

//   return (
//     <div className="mb-16 px-4 md:px-16">
//       <h1 className="text-4xl md:text-5xl font-sans">Explore by Category</h1>

//       <div className="flex flex-col md:flex-row items-center justify-between mt-6">
//         <div className="text-xl mb-4 md:mb-0">
//           <h1 className="mb-1">
//           Embark on thrilling adventures, uncover futuristic worlds, and ignite your curiosity with every page
//           </h1>
          
//         </div>

//         <div className="flex bg-secondary hover:bg-gray-500 flex-row items-center justify-center mx-2 rounded-lg shadow-md transition duration-300 px-8 py-2">
//           <Link to="/category" className="text-lg font-medium">
//             All Categories
//           </Link>
//           <ArrowRight className="ml-1" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-6">
//         {Object.entries(bookCategories) .slice(0, 4).map(([parent, subcategories]) => (
//          <div
//          key={parent}
//          className={`flex flex-col items-center rounded-2xl p-4 transition-transform duration-300 cursor-pointer ${
//            selectedCategory === parent ? "ring-2 ring-blue-500" : ""
//          }`}
//          onClick={() => handleCategoryClick(parent)}
//        >
       
//             <div className="w-full overflow-hidden h-80 rounded-md">
//               {subcategories.map((subcategory, index) => (
//                 <img
//                   key={index}
//                   className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
//                   src={subcategory}
//                   alt={`${parent} thumbnail ${index + 1}`}
//                 />
//               ))}
//             </div>
//             <h2 className="text-xl sm:text-2xl my-2">{parent}</h2>
//           </div>
//         ))}
//       </div>
    
  
      
//       <div className="w-full mt-10">
//         {loading && (
//           <p className="text-center text-lg text-gray-600">Loading books...</p>
//         )}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {selectedCategory && !loading && !error && books.length === 0 && (
//          <p className="text-center text-lg text-gray-600 flex flex-col items-center">
//          📚 No books found in "<span className="font-semibold">{selectedCategory}</span>".
//        </p>
       
//         )}

//         {selectedCategory && !loading && !error && books.length > 0 && (
//           <>
//             <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-6">
//               Books in "{selectedCategory}"
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
//               {books.map((book) => (
//                 <div
//                   key={book.id}
//                   className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center"
//                 >
//                   <img
//                     src={
//                       book.volumeInfo.imageLinks?.thumbnail ||
//                       "https://via.placeholder.com/128x192?text=No+Image"
//                     }
//                     alt={book.volumeInfo.title || "Book Cover"}
//                     className="w-32 h-48 object-cover mb-4"
//                   />
//                   <h3 className="text-lg font-semibold text-center">
//                     {book.volumeInfo.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 text-center">
//                     {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Categories;


import React, { useState } from "react";
import { bookCategories } from "../utils/data";
import api from "../Services/api";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const token = useAuthStore.getState().token;

  const fetchBooks = async (category) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/books/search", {
        params: { category },
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      });

      if (response.data?.items?.length > 0) {
        setBooks(response.data.items);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchBooks(category);
  };

  const handleToggleCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const categoriesToDisplay = showAllCategories
    ? Object.entries(bookCategories)
    : Object.entries(bookCategories).slice(0, 4);

  return (
    <div className="mb-16 px-4 md:px-16">
      <h1 className="text-4xl md:text-5xl font-sans">Explore by Category</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mt-6">
        <div className="text-xl mb-4 md:mb-0 text-center md:text-left">
          <h1 className="mb-1">
            Embark on thrilling adventures, uncover futuristic worlds, and
            ignite your curiosity with every page
          </h1>
        </div>

        <button
          onClick={handleToggleCategories}
          className="flex bg-secondary hover:bg-gray-500 flex-row items-center justify-center mx-2 rounded-lg shadow-md transition duration-300 px-8 py-2 text-lg font-medium"
        >
          {showAllCategories ? "Hide Categories" : "All Categories"}
          {showAllCategories ? (
            <ArrowLeft className="ml-1" />
          ) : (
            <ArrowRight className="ml-1" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-6">
      {categoriesToDisplay.map(([parent, subcategories]) => (
  <div
    key={parent}
    className={`flex flex-col items-center rounded-2xl p-4 transition-transform duration-300 cursor-pointer ${
      selectedCategory === parent ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={() => handleCategoryClick(parent)}
  >
    <div className="w-full overflow-hidden h-80 rounded-md relative">
     
      {subcategories.map((subcategory, index) => (
        <div
          key={index}
          className="relative group w-full h-full"
        >
          <img
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            src={subcategory.image}
            alt={`${parent} thumbnail ${index + 1}`}
          />
          <div className="absolute top-0 text-center left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-xl font-semibold">
            <span>{subcategory.text}</span>
          </div>
        </div>
      ))}
    </div>
    <h2 className="text-xl sm:text-2xl my-2">{parent}</h2>
  </div>
))}

      </div>

      <div className="w-full mt-10">
        {loading && (
           <div className="flex justify-center items-center h-full">
           <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
         </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {selectedCategory && !loading && !error && books.length === 0 && (
          <p className="text-center text-lg text-gray-600 flex flex-col items-center">
            📚 No books found in{" "} <span className="font-semibold">{selectedCategory}</span>
          </p>
        )}

        {selectedCategory && !loading && !error && books.length > 0 && (
          <>
            <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-6">
              Books in "{selectedCategory}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center"
                >
                  <img
                    src={
                        book.thumbnail
                    }
                    alt={book.title || "Book Cover"}
                    className="w-32 h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {book.authors?.join(", ") || "Unknown Author"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
