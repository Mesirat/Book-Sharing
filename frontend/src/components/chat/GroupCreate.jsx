import React, { useState, useEffect } from "react";
import api from "../../Services/api";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { io } from "socket.io-client";

const GroupCreate = ({
  onClose,
  isModalOpen,
  fetchGroups,
  currentPage,
  searchTerm,
}) => {
  const [groupName, setGroupName] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuthStore();
  const token = useAuthStore.getState().token;
  const socket = io("http://localhost:5000");

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupName") setGroupName(value);

    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !profilePic) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("creator", user?._id);
    formData.append("thumbnail", profilePic);

    try {
      const response = await api.post("/groups/createGroup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      socket.emit("newGroupAdded", response.data);

      fetchGroups(currentPage, searchTerm);

      setGroupName("");

      setProfilePic("");
      setError("");
      setSuccess("Group created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error creating group"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setGroupName("");

    setProfilePic(null);
    setError("");
    setSuccess("");
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="group-create-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create a New Group
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={groupName}
              onChange={handleInputChange}
              placeholder="Enter group name"
              className={`w-full p-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="profilePic"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 bg-gray-300 text-lg font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm">{success}</p>}
      </div>
    </div>
  );
};

export default GroupCreate;
