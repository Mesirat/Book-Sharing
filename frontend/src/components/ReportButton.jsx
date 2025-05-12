import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../Services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bug } from "lucide-react";

const ReportButton = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const token = useAuthStore.getState().token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    if (file) formData.append("thumbnail", file);

    try {
      const res = await api.post("/users/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Report sent successfully!");
        setOpen(false);
        setType("");
        setDescription("");
        setFile(null);
      } else {
        toast.error("Failed to send report.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending the report.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-secondary hover:bg-gray-400 text-red-800 px-4 py-4 font-bold rounded-full shadow-lg flex items-center space-x-2"
      >
        <Bug className="w-5 h-5" />
        <span>Report</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl text-black shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">Send Report</h2>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select issue type</option>
              <option value="bug">Bug</option>
              <option value="content">Inappropriate Content</option>
              <option value="feedback">General Feedback</option>
            </select>

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              required
            ></textarea>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
              accept="image/*"
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-black rounded hover:bg-gray-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default ReportButton;
