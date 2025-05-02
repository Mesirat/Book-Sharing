
import { useEffect, useState } from "react";
import axios from "axios";

const ReportManager=()=> {
    const [reports, setReports] = useState([]);
    const [response, setResponse] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
  
    const fetchReports = async () => {
      const res = await axios.get("/api/admin/reports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(res.data);
    };
  
    const submitResponse = async () => {
      await axios.put(
        `/api/admin/reports/${selectedReport._id}/respond`,
        { response },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResponse("");
      setSelectedReport(null);
      fetchReports();
    };
  
    useEffect(() => {
      fetchReports();
    }, []);
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User Reports</h2>
        {reports.map((report) => (
          <div key={report._id} className="border rounded p-4 mb-4">
            <p><strong>User:</strong> {report.user.name} ({report.user.email})</p>
            <p><strong>Subject:</strong> {report.subject}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p><strong>Response:</strong> {report.response || "Not yet responded"}</p>
  
            {!report.response && (
              <div className="mt-2">
                {selectedReport?._id === report._id ? (
                  <div>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full border p-2 mb-2"
                      placeholder="Write your response here..."
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                      onClick={submitResponse}
                    >
                      Submit Response
                    </button>
                    <button
                      className="ml-2 bg-gray-500 text-white px-4 py-1 rounded"
                      onClick={() => setSelectedReport(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedReport(report)}
                  >
                    Respond
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
}
export default ReportManager;
