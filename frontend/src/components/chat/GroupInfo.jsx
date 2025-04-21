import React from "react";

const GroupInfo = ({ group, onClose }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{group.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>

      {/* Group Description */}
      <p className="mb-4 text-gray-600">{group.description}</p>

      {/* Members */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul>
          {group.members.map((member) => (
            <li key={member._id} className="mb-2 flex items-center">
              <img
                src={member.profilePicture}
                alt={member.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              {member.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Media Section */}
      <div>
        <h3 className="text-lg font-semibold mt-4 mb-2">Shared Media</h3>
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
      </div>
    </div>
  );
};

export default GroupInfo;
