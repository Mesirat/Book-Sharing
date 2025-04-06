import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const GroupList = ({ setCurrentGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedGroup, setJoinedGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuthStore();
  const userName = user?.name;
  const userId = user?._id;

  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:5000");
    }

    socket.current.on("connect", () => console.log("Connected to server"));
    socket.current.on("error", (errorMessage) =>
      console.error("Server Error:", errorMessage)
    );

    const fetchGroups = async (page) => {
      try {
        const response = await fetch(`http://localhost:5000/groups?page=${page}&limit=5`);
        if (!response.ok) throw new Error("Failed to fetch groups");

        const data = await response.json();
        console.log("Fetched groups:", data.groups);
        console.log("Current userId:", userId);

        setGroups(data.groups || []);
        setTotalPages(data.totalPages || 1);

        const joinedGroupIds = data.groups
          .filter(
            (group) =>
              group.members &&
              group.members.some((member) => member.userId === userId)
          )
          .map((group) => String(group._id));
        console.log(joinedGroupIds);
        console.log(userId);

        setJoinedGroup(joinedGroupIds);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups(currentPage);

    return () => {
      if (socket.current) {
        socket.current.off("connect");
        socket.current.off("error");
        socket.current.disconnect();
      }
    };
  }, [currentPage, userId]);

  const handleJoinGroup = (groupName) => {
    if (!userName || !userId) {
      console.error("User details missing. Cannot join group.");
      return;
    }

    socket.current.emit("joinGroup", groupName, userId, userName, (response) => {
      if (response.error) {
        console.error("Join group failed:", response.error);
      } else {
        setJoinedGroup((prev) => [...prev, response.groupId]);
        setCurrentGroup(response.groupId);
      }
    });
  };

  const handleLeaveGroup = (groupId) => {
    if (!userId) {
      console.error("User details missing. Cannot leave group.");
      return;
    }

    socket.current.emit("leaveGroup", groupId, userId, (response) => {
      if (response.error) {
        console.error("Leave group failed:", response.error);
      } else {
        setJoinedGroup((prev) => prev.filter((id) => id !== groupId));
        setCurrentGroup(null);
      }
    });
  };

  if (loading) {
    return (
      <div>
        <Loader className="animate-spin mx-auto" />
      </div>
    );
  }

  if (!Array.isArray(groups)) {
    return <div>Error: Failed to load groups. Please try again later.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Groups</h2>
      {groups.length > 0 ? (
        groups.map((group) => {
          const isMember = joinedGroup.includes(group._id);

          return (
            <div
              key={group._id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{group.name}</span>
              <div>
                <button
                  disabled={loading}
                  onClick={() =>
                    isMember
                      ? handleLeaveGroup(group._id)
                      : handleJoinGroup(group.name)
                  }
                  className={`ml-2 px-4 py-1 ${
                    isMember ? "bg-gray-500" : "bg-blue-500"
                  } text-white rounded`}
                >
                  {loading ? (
                    <Loader className="animate-spin mx-auto" />
                  ) : isMember ? (
                    "Leave"
                  ) : (
                    "Join"
                  )}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>No groups available</div>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GroupList;
