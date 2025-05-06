import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import GroupCreate from "./GroupCreate";
import { toast, ToastContainer } from "react-toastify";
import api from "../../Services/api";
const GroupList = ({ currentGroup, setCurrentGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedGroup, setJoinedGroup] = useState([]);
  const [isJoining, setIsJoining] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);
const token = useAuthStore.getState().token;
  const socket = useRef(null);

  const fetchGroups = async (search = "") => {
    try {
      const response = await api.get(`/groups?search=${search}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setGroups(response.data.groups || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setGroups([]);
      } else {
        console.error("Error fetching groups:", error);
        setError("Failed to load groups. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:5000");
    }

    socket.current.on("connect", () => console.log("Connected to server"));
    socket.current.on("error", (errorMessage) =>
      console.error("Server Error:", errorMessage)
    );

    socket.current.on("newGroupAdded", (newGroup) => {
      setGroups((prevGroups) => {
        if (prevGroups.some((group) => group._id === newGroup._id))
          return prevGroups;
        return [newGroup, ...prevGroups];
      });
    });

    socket.current.on("userJoinedGroup", ({ groupId, memberCount }) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId ? { ...group, memberCount } : group
        )
      );
    });

    socket.current.on("userLeftGroup", ({ groupId, memberCount }) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId ? { ...group, memberCount } : group
        )
      );
    });

    fetchGroups(searchTerm);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [searchTerm, user._id]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(
      () => fetchGroups(e.target.value),
      500
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleJoinGroup = async (groupId, groupName) => {
    try {
      setIsJoining(groupId);
      const response = await fetch(
        `http://localhost:5000/groups/join/${groupId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) throw new Error("Failed to join group");

      setJoinedGroup((prev) => [...prev, String(groupId)]);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                memberCount: group.memberCount + 1,
                members: [...(group.members || []), user._id],
              }
            : group
        )
      );

      socket.current.emit("joinGroup", { groupId, userId: user._id });
      toast.success(`Successfully joined ${groupName}`);
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Error joining group. Please try again later.");
    } finally {
      setIsJoining(null);
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    try {
      setIsJoining(groupId);
      const response = await fetch(
        `http://localhost:5000/groups/leave/${groupId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) throw new Error("Failed to leave group");

      setJoinedGroup((prev) => prev.filter((id) => id !== String(groupId)));
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                memberCount: Math.max(0, group.memberCount - 1),
                members: (group.members || []).filter((id) => id !== user._id),
              }
            : group
        )
      );

      socket.current.emit("leaveGroup", { groupId, userId: user._id });
      toast.success("Successfully left the group");
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Error leaving group. Please try again later.");
    } finally {
      setIsJoining(null);
    }
  };

  const handleGroupClick = (group) => {
    const isMember = group.members?.includes(user._id);
    if (isMember) {
      setCurrentGroup(group);
    } else {
      toast.warn("You need to join the group first to chat!");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg w-[90vw] shadow-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Groups</h2>

      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
        >
          Create Group
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
        />
      </div>

      {groups.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 pb-4 px-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {groups.map((group) => {
            const isMember = group.members?.includes(user._id);
            const memberCount = group.memberCount || 0;

            return (
              <div
                key={group._id}
                className="min-w-[300px] flex flex-col justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => handleGroupClick(group)}
                >
                  <img
                    src={`${group.profilePic}`}
                    alt={group.groupName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      {group.groupName}
                    </span>
                    <span className="text-gray-500">{memberCount} members</span>
                  </div>
                </div>
                <div className="mt-4">
                  {isMember ? (
                    <button
                      onClick={() =>
                        handleLeaveGroup(group._id, group.groupName)
                      }
                      disabled={isJoining === group._id}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all disabled:opacity-50"
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleJoinGroup(group._id, group.groupName)
                      }
                      disabled={isJoining === group._id}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No groups found.</p>
      )}

      <ToastContainer />
      <GroupCreate
        onClose={closeModal}
        isModalOpen={isModalOpen}
        fetchGroups={fetchGroups}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default GroupList;
