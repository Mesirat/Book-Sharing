import { useCallback, useEffect, useState } from "react";
import api from "../../Services/api";
import { useAuthStore } from "../../store/authStore";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const token = useAuthStore.getState().token;

  const fetchReports = async () => {
    try {
      const res = await api.get("/users/myreports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      setModalImage(null);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🗂 My Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-600">You haven't submitted any reports yet.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-5"
            >
              <div className="mb-3 space-y-2 max-w-full">
                <p className="break-words">
                  <span className="font-semibold text-gray-700">📌 Subject:</span>{" "}
                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                </p>
                <p className="break-words">
                  <span className="font-semibold text-gray-700">📝 Message:</span>{" "}
                  {report.description}
                </p>

                {report.screenshotUrl && (
                  <div className="mt-3 flex justify-center sm:justify-start">
                    <img
                      src={report.screenshotUrl}
                      alt="Report screenshot"
                      className="max-w-full max-h-60 rounded-md border border-gray-300 cursor-pointer sm:max-w-xs"
                      loading="lazy"
                      onClick={() => setModalImage(report.screenshotUrl)}
                      title="Click to view fullscreen"
                    />
                  </div>
                )}

                <p>
                  <span className="font-semibold text-gray-700">✅ Response:</span>{" "}
                  {report.response ? (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-sm font-medium break-words">
                      {report.response}
                    </span>
                  ) : (
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md text-sm font-medium">
                      Pending
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 sm:p-10"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Fullscreen report screenshot"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MyReports;
