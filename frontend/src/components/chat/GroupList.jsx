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
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);
  const socket = useRef(null);

  const { user, token } = useAuthStore.getState();

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

  const handleJoinGroup = async (groupId, groupName) => {
    try {
      setIsJoining(groupId);

      const response = await api.post(
        `/groups/join/${groupId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const response = await api.delete(`/groups/leave/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const groupsNotJoined = groups.filter(
    (group) => !group.members?.includes(user._id)
  );

  return (
      groupsNotJoined.length > 0 && (
    <div className="bg-gray-100 w-[90vw] px-6">
      <div className=" mb-12">
        <h1 className="text-5xl mb-4">Groups You Might Like</h1>
        <p className="text-lg text-gray-600">
          Discover communities based on your favorite books and genres to start
          meaningful conversations and grow your reading network.
        </p>
      </div>

        <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="flex w-max  space-x-10 pb-4 px-1 hide-scrollbar">

            {groupsNotJoined.map((group) => {
              const isMember = group.members?.includes(user._id);
              const memberCount = group.memberCount || 0;

              return (
                <div
                  key={group._id}
                  className="flex-shrink-0 w-[220px] flex flex-col justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-all"
                >
                  <div
                    className="flex flex-col items-center space-x-4 cursor-pointer"
                    onClick={() => handleGroupClick(group)}
                  >
                    <img
                      src={group.profilePic}
                      alt={group.groupName}
                      className="w-36 h-36 rounded-full object-cover"
                    />
                    <span className="font-semibold text-lg">
                      {group.groupName}
                    </span>
                    <span className="text-gray-500">{memberCount} members</span>
                  </div>
                  <div className="mt-2">
                    {!isMember ? (
                      <button
                        onClick={() =>
                          handleJoinGroup(group._id, group.groupName)
                        }
                        disabled={isJoining === group._id}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:text-green-500 transition-all disabled:opacity-50"
                      >
                        {isJoining === group._id ? "Joining..." : "Join"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleLeaveGroup(group._id, group.groupName)
                        }
                        disabled={isJoining === group._id}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all disabled:opacity-50"
                      >
                        {isJoining === group._id ? "Leaving..." : "Leave"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      

      <ToastContainer />
    </div>
      )
  );
};

export default GroupList;
