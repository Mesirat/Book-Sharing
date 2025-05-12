import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Services/api";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const UserReadingProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const res = await api.get(`/users/getAllProgress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProgressData(res.data.progress);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reading progress:", err);
        setError("Failed to fetch reading progress.");
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await api.get(`/users/getBlogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(Array.isArray(res.data.blogs) ? res.data.blogs : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    
    fetchAllProgress();
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="text-center py-4">
        <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 mx-auto"></div>
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const completedBooks = Array.isArray(progressData) ? progressData.filter(
    (item) => Math.floor((item.currentPage / item.totalPages) * 100) === 100
  ) : [];
  
  const inProgressBooks = Array.isArray(progressData) ? progressData.filter(
    (item) => Math.floor((item.currentPage / item.totalPages) * 100) < 100
  ) : [];

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* In Progress Books */}
        <div className="flex-1 space-y-4 h-auto md:h-[85vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6">What You're Reading</h2>
          {inProgressBooks.length === 0 ? (
            <p>No books currently being read. Start your journey now!</p>
          ) : (
            inProgressBooks.map((item) => {
              const progressPercent = Math.floor(
                (item.currentPage / item.totalPages) * 100
              );

              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row gap-4 items-start p-4 shadow rounded bg-white"
                >
                  <img
                    src={item.book?.thumbnail || "/default-book.png"}
                    alt={`Cover of ${item.book?.title}`}
                    className="w-16 h-24 object-cover rounded mx-auto md:mx-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">{item.book?.title || "Untitled Book"}</h3>
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="h-3 bg-green-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="text-sm font-medium text-gray-600 mr-1">
                            Last Read:
                          </span>
                          {new Date(item.updatedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <Link
                        to={`/readBook/${item.book?._id}`}
                        className="text-sm px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
                      >
                        {progressPercent === 100 ? "Finished" : "Continue"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
        </div>

        
        <div className="flex-2 space-y-4 px-12 md:px-4 h-auto md:h-[89vh] overflow-y-auto scrollbar-track-gray-100 hide-scrollbar">
          {Array.isArray(blogs) && blogs.length === 0 ? (
            <p>No news or updates yet. Stay tuned!</p>
          ) : (
            blogs.map((blog, index) => (
              <div
                key={index}
                className="p-2 rounded-lg border-2 text-center border-secondary mb-4"
              >
                <img
                  src={blog?.thumbnail || "/default-book.png"}
                  alt={`Cover of ${blog.title}`}
                  className="w-full h-56 object-cover mb-1"
                />
                <h4 className="text-lg mb-2">{blog.title}</h4>
                <div className="bg-blue-100 p-2 rounded-md">
                  <p className="text-blue-500 mb-2">{blog.description}</p>
                </div>
                <p className="text-xs text-gray-400 text-end">
                  {new Date(blog.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            ))
          )}

          {completedBooks.length !== 0 && (
            <div className="bg-secondary rounded p-4">
              <h3 className="text-xl text-white text-center font-semibold mb-6">Library of Completions</h3>
            </div>
          )}

          {completedBooks.length === 0 ? (
            <p className="text-white px-4"></p>
          ) : (
            completedBooks.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/readBook/${item.book._id}`)}
                className="flex gap-4 items-start py-2 px-4 shadow rounded bg-white cursor-pointer hover:bg-gray-50 transition"
              >
                <img
                  src={item.book?.thumbnail || "/default-book.png"}
                  alt={`Cover of ${item.book?.title}`}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-medium">{item.book?.title || "Untitled Book"}</h3>
                  <div className="w-full bg-gray-200 h-3 rounded">
                    <div
                      className="h-3 bg-green-500 rounded-full"
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <CircleCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(item.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReadingProgress;
