import React from "react";

const GroupInfo = ({ group, onClose }) => {
  if (!group) return null;

  return (
    <div className="absolute top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg z-20 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold truncate">{group.groupName || group.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 font-semibold text-sm"
        >
          Close
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul>
          {group.members?.map((member) => (
            <li key={member._id} className="mb-2 flex items-center">
              <img
                src={member.profilePicture || "/default-avatar.png"}
                alt={member.name || member.firstName}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              {member.name || member.firstName}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4 mb-2">Shared Media</h3>
        {group.media?.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {group.media.map((media, index) => (
              <img
                key={index}
                src={media.url}
                alt="Shared Media"
                className="w-full h-24 object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No media shared yet.</p>
        )}
      </div>
    </div>
  );
};

export default GroupInfo;
