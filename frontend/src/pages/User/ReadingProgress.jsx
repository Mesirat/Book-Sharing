import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/users";

const UserReadingProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const res = await axios.get(`${API_URL}/getAllProgress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setProgressData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reading progress:", err);
        setError("Failed to fetch reading progress.");
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/getBlogs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setBlogs(res.data);
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

  const completedBooks = progressData.filter(
    (item) => Math.floor((item.currentPage / item.totalPages) * 100) === 100
  );

  const inProgressBooks = progressData.filter(
    (item) => Math.floor((item.currentPage / item.totalPages) * 100) < 100
  );

  return (
    <div className="">
      <div className="flex gap-6">
        <div className="flex-1 space-y-4 h-[85vh] overflow-y-auto">
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
                  className="flex gap-4 items-start p-4 shadow rounded bg-white"
                >
                  <img
                    src={item.book?.thumbnail || "/default-book.png"}
                    alt={`Cover of ${item.book?.title}`}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">
                      {item.book?.title || "Untitled Book"}
                    </h3>

                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="h-3 bg-green-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {" "}
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
                        to={`/readBook/${item.book._id}`}
                        className="text-sm px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
                      >
                        {progressPercent === 100
                          ? "Finish Reading"
                          : "Continue Reading"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex-2 space-y-4 px-1  h-[89vh] overflow-y-auto ">
          {blogs.length === 0 ? (
            <p>No news or updates yet. Stay tuned!</p>
          ) : (
            blogs.map((blog, index) => (
              <div
                key={index}
                className="p-2 border border-white rounded-md p-3   mb-4"
              >
                <img
                  src={blog?.thumbnail || "/default-book.png"}
                  alt={`Cover of ${blog.title}`}
                  className="w-full h-56  object-cover mb-1 "
                />
                <h4 className="text-lg  mb-2">{blog.title}</h4>
                <div className="bg-blue-100 p-2 rounded-md">
                  <p className="text-blue-500  mb-2">{blog.description}</p>
                </div>
                <p className="text-xs ml-48 text-gray-400">
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
            <div className="bg-secondary rounded p-">
              <h3 className="text-xl text-white text-center mt-4 font-semibold mb-6 p-2">
                Library of Completions
              </h3>
            </div>
          )}

          {completedBooks.length === 0 ? (
            <p className="text-white px-4">
              No books finished yet. Keep going!
            </p>
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
                  <h3 className="text-xl font-medium">
                    {item.book?.title || "Untitled Book"}
                  </h3>
                  <div className="w-full bg-gray-200 h-3 rounded">
                    <div
                      className="h-3 bg-green-500 rounded-full"
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end">
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
