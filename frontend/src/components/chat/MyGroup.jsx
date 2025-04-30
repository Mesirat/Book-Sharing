import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GroupChat from "../../pages/GroupChat";
import { useAuthStore } from "../../store/authStore";
const MyGroups = ({ userId, currentGroup, setCurrentGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredGroups, setFilteredGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchUserGroups = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/groups/mygroups/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setGroups(data.groups);
      const joinedGroupIds = data.groups.map((group) => group._id);
      setJoinedGroups(joinedGroupIds);
    } catch (err) {
      setError("Failed to load your groups. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserGroups();
    }
  }, [userId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = groups.filter((group) =>
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchTerm, groups]);

  const handleGroupClick = (group) => {
    const isMember = joinedGroups.includes(group._id);
    if (isMember) {
      if (!currentGroup || currentGroup._id !== group._id) {
        setCurrentGroup(group);
      }
    } else {
      alert("You need to join the group first to chat!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 text-text z-10  p-1">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-center ">No groups found.</p>
      ) : (
        <div className="space-y-4 z-50 p-1">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              role="button"
              tabIndex={0}
              onClick={() => handleGroupClick(group)}
              className={`w-full  min-h-16 px-4 py-2 border rounded-md shadow-md cursor-pointer  flex items-center ${
                currentGroup && currentGroup._id === group._id
                  ? "bg-secondary ring-2 ring-blue-200 outline-none"
                  : "hover:bg-gray-300 hover:bg-opacity-70"
              } `}
            >
              <div className="flex items-center space-x-4 w-full h-full">
                {group.profilePic ? (
                  <img
                    src={group.profilePic}
                    alt={group.groupName}
                    className="w-12 h-12 rounded-full object-cover "
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-button flex items-center justify-center">
                    <span className="font-bold text-sm uppercase">
                      {group.groupName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{group.groupName}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
