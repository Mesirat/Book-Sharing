import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Services/api";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import TopRead from "../../components/TopRead";

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
    <div className="flex flex-col lg:flex-row gap-6">
      

      <div className="w-full lg:w-1/2 space-y-4 overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">What You're Reading</h2>
        {inProgressBooks.length === 0 ? (
          <>
            <p className="text-gray-600">No books currently being read. Start your journey now!</p>
            <TopRead />
          </>
        ) : (
          inProgressBooks.map((item) => {
            const progressPercent = Math.floor((item.currentPage / item.totalPages) * 100);
            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-4 items-start p-4 shadow rounded bg-white"
              >
                <img
                  src={item.book?.thumbnail || "/default-book.png"}
                  alt={`Cover of ${item.book?.title}`}
                  className="w-20 h-auto object-cover rounded mx-auto sm:mx-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.book?.title || "Untitled Book"}</h3>
                  <div className="w-full bg-gray-200 h-3 rounded mt-2">
                    <div
                      className="h-3 bg-secondary rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end mt-4 flex-wrap gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium mr-1">Last Read:</span>
                      {new Date(item.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
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
      <div className="w-full lg:w-1/2 space-y-6 overflow-auto hide-scrollbar max-h-[80vh] px-2">
      <div className="w-full  space-y-6 overflow-auto hide-scrollbar">
  <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
    📰 Latest News & Updates
  </h2>

  {Array.isArray(blogs) && blogs.length === 0 ? (
    <p className="text-center text-gray-500 italic mt-10">
      No news or updates yet. Stay tuned!
    </p>
  ) : (
    blogs.map((blog, index) => (
      <div
        key={index}
        className="flex gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow hover:shadow-md transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <img
          src={blog?.thumbnail || "/default-book.png"}
          alt={`Cover of ${blog.title}`}
          className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
              {blog.title}
            </h4>
            <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
              <p className="text-blue-700 text-sm leading-snug line-clamp-3">
                {blog.description}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-right mt-2 font-mono">
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
      </div>
    ))
  )}
</div>


  {completedBooks.length > 0 && (
    <section className="bg-gray-900 text-white rounded-lg p-6 mt-10 shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6 tracking-wide">
        Library of Completions
      </h3>
      {completedBooks.map((item) => (
        <div
          key={item._id}
          onClick={() => navigate(`/readBook/${item.book._id}`)}
          className="flex gap-5 items-start p-4 mb-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        >
          <img
            src={item.book?.thumbnail || "/default-book.png"}
            alt={`Cover of ${item.book?.title}`}
            className="w-16 h-12 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {item.book?.title || "Untitled Book"}
            </h3>
            <div className="w-full bg-gray-300 h-4 rounded-full mt-3 overflow-hidden">
              <div className="h-4 bg-green-500 rounded-full w-full"></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5 text-green-600" />
                <time className="font-mono text-xs" dateTime={item.updatedAt}>
                  {new Date(item.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )}
</div>

    </div>
  </div>
  
  );
};

export default UserReadingProgress;
