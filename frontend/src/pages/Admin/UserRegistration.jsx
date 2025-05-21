import { useState } from "react";
import Papa from "papaparse";
import { useAuthStore } from "../../store/authStore";

const UserRegistration = () => {
  const [file, setFile] = useState(null);
  const [generatedUsers, setGeneratedUsers] = useState([]);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uploadUsers = useAuthStore((state) => state.uploadUsers);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
    setGeneratedUsers([]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a CSV file.");

    try {
      const data = await uploadUsers(file);
      setGeneratedUsers(data.users);
      setUploadSuccess(true);
      setError("");
    } catch (err) {
      setUploadSuccess(false);
      setError("Upload failed. Please try again.");
      console.error(err);
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(generatedUsers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "generated_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl text-text shadow-lg max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 ">Upload User CSV</h2>

     
      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded mb-6 text-sm">
        <p className="font-medium">Instructions:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Accepted format: <strong>.csv</strong> file</li>
          <li>Columns required: <code>name</code>, <code>email</code></li>
          <li>Password will be automatically generated for each user</li>
          <li>You can download the registered credentials after upload</li>
        </ul>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className=" bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          Upload & Register
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

     
      {uploadSuccess && generatedUsers.length > 0 && (
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700 rounded">
          <p className="font-semibold">Success!</p>
          <p className="text-sm">
            {generatedUsers.length} user(s) registered successfully.
          </p>
        </div>
      )}

      {generatedUsers.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-gray-800">Registered Users</p>
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Download Credentials
            </button>
          </div>

          <ul className="divide-y divide-gray-200 border rounded-md max-h-64 overflow-y-auto">
            {generatedUsers.map((u, idx) => (
              <li key={idx} className="px-4 py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{u.username}</p>
                  <p className="text-sm text-gray-500">{u.firstName+" "+u.lastName}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <span className="font-mono text-gray-600 text-sm">{u.password}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;
