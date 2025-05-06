import React, { useState, useEffect } from "react";
import api from "../../Services/api";
import Cards from "../../components/Cards";
import SideBar from "../../components/headers/bars/SideBar";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../../components/headers/bars/NavBar";
import { Loader } from "lucide-react";
import { ReadingProgress } from "../../../../backend/models/user/readingProgressModel";
import UserReadingProgress from "./ReadingProgress";
import GroupList from "../../components/chat/GroupList";

const User = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  useEffect(() => {
    if (query.trim()) {
      searchBooks(query);
    }
  }, [searchParams]);

  const searchBooks = async (searchQuery) => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("books/search", {
          params: { query: searchQuery },
        });
        const data = response.data;
        setBooks(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="font-sans relative min-h-screen bg-customLight flex">
        <SideBar />
        <div
          className={`flex-1 py-3 px-4   ${
            location.pathname === "/user/chat"
              ? "ml-6"
              : "ml-12 md:ml-16 lg:ml-16"
          }`}
        >
          {location.pathname === "/user" && (
            <>
              {!query && (
                <>
                  <UserReadingProgress />
                  {/* <div className="overflow-x-auto hide-scrollbar px-1 py-2">
                    <GroupList />
                  </div> */}
                </>
              )}
              <Cards books={books} />
            </>
          )}

        
          {error && (
            <div className="text-red-500 text-center my-12">{error}</div>
          )}

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default User;
