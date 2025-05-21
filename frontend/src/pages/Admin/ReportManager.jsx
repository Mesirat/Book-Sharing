import { useEffect, useState, useCallback } from "react";
import api from "../../Services/api";
import { useAuthStore } from "../../store/authStore";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [response, setResponse] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const token = useAuthStore.getState().token;

  const fetchReports = async () => {
    const res = await api.get("/admin/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setReports(res.data);
  };

  const submitResponse = async () => {
    await api.put(
      `/admin/reports/${selectedReport._id}/respond`,
      { response },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setResponse("");
    setSelectedReport(null);
    fetchReports();
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        📋 User Reports
      </h2>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <p>
                    <span className="font-semibold text-gray-700">
                      👤 User:
                    </span>{" "}
                    {report.user.firstName} ({report.user.email})
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      📌 Subject:
                    </span>{" "}
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      📝 Message:
                    </span>{" "}
                    {report.description}
                  </p>

                  {report.screenshotUrl && (
                    <div className="mt-3">
                      <img
                        src={report.screenshotUrl}
                        alt="Report screenshot"
                        className="max-w-full sm:max-w-xs max-h-60 rounded-md border border-gray-300 cursor-pointer"
                        loading="lazy"
                        onClick={() => setModalImage(report.screenshotUrl)}
                        title="Click to view fullscreen"
                      />
                    </div>
                  )}

                  <p>
                    <span className="font-semibold text-gray-700">
                      ✅ Response:
                    </span>{" "}
                    {report.response || (
                      <span className="text-red-500">Not yet responded</span>
                    )}
                  </p>
                </div>

                {!report.response && selectedReport?._id !== report._id && (
                  <div className="sm:self-start">
                    <button
                      className="w-full sm:w-auto bg-gray-800 hover:bg-secondary text-white px-4 py-2 rounded-md"
                      onClick={() => setSelectedReport(report)}
                    >
                      Respond
                    </button>
                  </div>
                )}
              </div>

              {!report.response && selectedReport?._id === report._id && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Write your response here..."
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setSelectedReport(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-secondary text-white px-4 py-2 rounded-md"
                      onClick={submitResponse}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Fullscreen report screenshot"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ReportManager;
