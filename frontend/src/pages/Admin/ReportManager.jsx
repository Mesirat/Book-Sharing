import { useEffect, useState } from "react";
import api from "../../Services/api";
import { useAuthStore } from "../../store/authStore";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [response, setResponse] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
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

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 User Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
           <div
           key={report._id}
           className="bg-white shadow-md border border-gray-200 rounded-lg p-5"
         >
           <div className="flex justify-between items-start">
             <div className="mb-3 space-y-1">
               <p>
                 <span className="font-semibold text-gray-700">👤 User:</span>{" "}
                 {report.user.firstName} ({report.user.email})
               </p>
               <p>
                 <span className="font-semibold text-gray-700">📌 Subject:</span>{" "}
                 {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
               </p>
               <p>
                 <span className="font-semibold text-gray-700">📝 Message:</span>{" "}
                 {report.description}
               </p>
               <p>
                 <span className="font-semibold text-gray-700">✅ Response:</span>{" "}
                 {report.response || (
                   <span className="text-red-500">Not yet responded</span>
                 )}
               </p>
             </div>
             {!report.response && selectedReport?._id !== report._id && (

               <button
                 className="h-fit bg-gray-800 hover:bg-secondary text-white px-4 py-2 rounded-md"
                 onClick={() => setSelectedReport(report)}
               >
                 Respond
               </button>
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
               <div className="flex gap-3">
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
    </div>
  );
};

export default ReportManager;
