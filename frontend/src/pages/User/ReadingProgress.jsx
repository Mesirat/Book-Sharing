import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ReadingProgress = () => {
  const [progressList, setProgressList] = useState([]);
  const API_URL = "http://localhost:5000/users"; // Adjust to your backend

  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const res = await axios.get(`${API_URL}/getAllProgress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProgressList(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchAllProgress();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Reading Progress
      </h1>

      {progressList.length === 0 ? (
        <p className="text-center text-gray-500">
          You are not reading any books at the moment.
        </p>
      ) : (
        <div className="space-y-6">
          {progressList.map((progress) => (
            <div
              key={progress._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {progress.book.title}
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Author:</span> {progress.book.author}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-700">
                    Progress: {progress.currentPage} / {progress.totalPages} pages
                  </span>
                  <span className="text-sm text-blue-700 font-semibold">
                    {progress.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <Link
                to={`/read/${progress.book._id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Continue Reading
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingProgress;
