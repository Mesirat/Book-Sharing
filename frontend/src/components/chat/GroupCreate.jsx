import React, { useState } from "react";
import axios from "axios";

const GroupCreate = ({ createGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setGroupName(e.target.value);
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name cannot be empty or just whitespace.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/groups/createGroup", { groupName });
      createGroup(response.data.group);
      setGroupName("");
      setError("");
      setSuccess("Group created successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-create">
      <h2 className="text-2xl font-bold">Create a New Group</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={groupName}
          onChange={handleInputChange}
          placeholder="Enter group name"
          className={`p-2 border rounded ${error ? "border-red-500" : "border-gray-300"}`}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default GroupCreate;
