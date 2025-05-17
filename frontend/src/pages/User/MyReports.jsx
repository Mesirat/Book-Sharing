import { useEffect, useState } from "react";
import api from "../../Services/api";
import { useAuthStore } from "../../store/authStore";

const MyReports =()=> {
  const [reports, setReports] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const token = useAuthStore.getState().token;

  const fetchReports = async () => {
    const res = await api.get("/users/my-reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReports(res.data);
  };

  const submitReport = async () => {
    await api.post(
      "/users/report",
      { subject, message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSubject("");
    setMessage("");
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Reports</h2>

    
      <div className="border p-4 rounded mb-6">
        <h3 className="text-xl mb-2">Submit a New Report</h3>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border mb-2 rounded"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border mb-2 rounded"
          rows={4}
        ></textarea>
        <button
          onClick={submitReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Report
        </button>
      </div>

     
      <div>
        {reports.map((report) => (
          <div key={report._id} className="border p-4 rounded mb-4">
            <p><strong>Subject:</strong> {report.subject}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p><strong>Submitted:</strong> {new Date(report.createdAt).toLocaleString()}</p>
            <p>
              <strong>Admin Response:</strong>{" "}
              {report.response ? (
                <span className="text-green-600">{report.response}</span>
              ) : (
                <span className="text-gray-500">Pending</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
 export default MyReports;