import React, { useState, useEffect } from "react";
import api from "../../Services/api";
import Cards from "../../components/Cards";
import SideBar from "../../components/headers/bars/SideBar";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../../components/headers/bars/NavBar";

import UserReadingProgress from "./ReadingProgress";
import GroupList from "../../components/chat/GroupList";
import { useAuthStore } from "../../store/authStore";
import Recommendation from "./Recommendation";

const User = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore.getState().token;
  const { user } = useAuthStore();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  useEffect(() => {
    if (query.trim()) {
      searchBooks(query, page);
    }
  }, [query, page]);

  const searchBooks = async (searchQuery, currentPage = 1) => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("books/search", {
          params: {
            query: searchQuery,
            page: currentPage,
            limit: 8,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setBooks(data.books || []);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
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
              ? "ml-8"
              : "ml-2 md:ml-8 lg:ml-16"
          }`}
        >
          {location.pathname === "/user" && (
            <>
              {!query && (
                <>
                  <UserReadingProgress />
                  <Recommendation user={user} />
                  <div className="overflow-x-auto hide-scrollbar px-1">
                    <GroupList />
                  </div>
                </>
              )}
              {query && (
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Search results for:{" "}
                  <span className="text-blue-600">{query}</span>
                </h2>
              )}
              <Cards books={books} />
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  <span className="px-4 py-1 font-medium">{`Page ${page} of ${totalPages}`}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
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
