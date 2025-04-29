import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import GroupCreate from "./GroupCreate";
import { toast, ToastContainer } from "react-toastify";

const GroupList = ({currentGroup, setCurrentGroup}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedGroup, setJoinedGroup] = useState([]);
  const [isJoining, setIsJoining] = useState(null);

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const socket = useRef(null);

  // Fetch groups function defined outside useEffect
  const fetchGroups = async (page, search = "") => {
    const limit = 10;
    try {
      const response = await fetch(
        `http://localhost:5000/groups?page=${page}&limit=${limit}&search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 404) {
        setGroups([]);
        setTotalPages(1);
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch groups");

      const data = await response.json();
      setGroups(data.groups || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load groups. Please try again later.");
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

    // Calling the fetchGroups function here
    fetchGroups(currentPage, searchTerm);

    return () => {
      if (socket.current) {
        socket.current.off("connect");
        socket.current.off("error");
        socket.current.off("newGroupAdded");
        socket.current.off("userJoinedGroup");
        socket.current.off("userLeftGroup");
        socket.current.disconnect();
      }
    };
  }, [currentPage, searchTerm, user._id]);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    localStorage.setItem("searchTerm", search);
    setCurrentPage(1);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) throw new Error("Failed to join group");

      const data = await response.json();

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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) throw new Error("Failed to leave group");

      const data = await response.json();

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
     console.log(group)
    } else {
      toast.warn("You need to join the group first to chat!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader className="animate-spin mx-auto text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className=" bg-gray-100 rounded-lg shadow-lg mx-auto ">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Groups</h2>
      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
        >
          Create Group
        </button>
      </div> */}
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
        groups.map((group) => {
          const isMember = group.members?.includes(user._id);
          const memberCount = group.memberCount || 0;

          return (
            <div
              key={group._id}
              className="flex justify-between items-center p-4 mb-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              <div
                className="flex items-center space-x-4"
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
              <div className="flex space-x-2">
                {isMember ? (
                  <button
                    onClick={() => handleLeaveGroup(group._id, group.groupName)}
                    disabled={isJoining === group._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all disabled:opacity-50"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group._id, group.groupName)}
                    disabled={isJoining === group._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No groups found.</p>
      )}

      <div className="flex justify-center space-x-4 mt-6">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="text-blue-600 hover:text-blue-800 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <span>
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="text-blue-600 hover:text-blue-800 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <ToastContainer />
      <GroupCreate onClose={closeModal} isModalOpen={isModalOpen} fetchGroups={fetchGroups} currentPage={currentPage}
        searchTerm={searchTerm}/>

    </div>
  );
};

export default GroupList;
