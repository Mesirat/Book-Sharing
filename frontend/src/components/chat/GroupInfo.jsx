import React, { useEffect, useState, useRef } from "react";
import api from "../../Services/api";
import { useAuthStore } from "../../store/authStore";
import { Users, X } from "lucide-react";

const GroupInfo = ({ groupId, onClose }) => {
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const token = useAuthStore.getState().token;
  const userId = user._id;

  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (!groupId || !userId) return;

    const fetchGroupInfo = async () => {
      try {
        const res = await api.get(`/groups/${groupId}/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setGroupDetails(res.data);
      } catch (error) {
        console.error("Error fetching group info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [groupId, userId]);

  if (!groupDetails || loading) return null;
  const { group, members } = groupDetails;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="relative w-full sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg p-6 overflow-y-auto rounded-lg"
      >
        <div className="flex justify-between mb-12">
          <h2 className="text-lg">Group Info</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 font-semibold text-sm"
          >
            <X className="text-red-600" />
          </button>
        </div>

        <div className="flex  items-center mb-4 border-b pb-2">
          <img
            src={group.profilePic || "/default-avatar.png"}
            alt={group.name}
            className="w-24 h-24 rounded-full border-2 border-black mr-2 object-cover"
          />
          <h2 className="text-2xl font-bold truncate">{group.name}</h2>
        </div>

        <div>
          <div className="flex ">
            <Users className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold mb-2">
              {members.length} Members{" "}
            </h3>
          </div>

          <ul>
            {members?.map((member) => (
              <li key={member._id} className="mb-2 flex items-center">
                <img
                  src={member.profilePic || "/default-avatar.png"}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                {member.name}
                {group.creator?._id === member._id && (
                  <span className="ml-48 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    Owner
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
