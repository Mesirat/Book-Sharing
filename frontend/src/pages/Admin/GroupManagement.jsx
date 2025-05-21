import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const GroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState(null);

  const token = useAuthStore.getState().token;

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setGroups(Array.isArray(res.data.groups) ? res.data.groups : []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteGroupId(id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/groups/${confirmDeleteGroupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchGroups();
      setConfirmDeleteGroupId(null);
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  const handleEdit = (group) => {
    setEditingGroup({ ...group });
    if (group.profilePic) {
      setProfilePicPreview(group.profilePic);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      if (editingGroup.groupName) {
        formData.append("groupName", editingGroup.groupName);
      }

      if (editingGroup.profilePic instanceof File) {
        formData.append("thumbnail", editingGroup.profilePic);
      }
      setLoading(true);
      await api.put(`/groups/${editingGroup._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setEditingGroup(null);
      setProfilePicPreview(null);
      fetchGroups();
      setLoading(false);
    } catch (err) {
      console.error("Error updating group:", err);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const query = searchQuery.toLowerCase();
    return (
      group.groupName.toLowerCase().includes(query) ||
      group.creator?.email?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Group Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by group name or creator"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Group</h3>

            {Object.entries(editingGroup).map(([key, value]) => {
              if (
                [
                  "_id",
                  "__v",
                  "createdAt",
                  "updatedAt",
                  "members",
                  "creator",
                  "description",
                  "memberCount",
                  "cloudinaryPublicId",
                ].includes(key)
              )
                return null;

              return (
                <div key={key} className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>

                  {key === "profilePic" ? (
                    <div>
                      {profilePicPreview && (
                        <img
                          src={profilePicPreview}
                          alt="Profile Preview"
                          className="w-24 h-24 object-cover rounded-full border mb-3"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setEditingGroup({ ...editingGroup, [key]: file });
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setProfilePicPreview(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setEditingGroup({
                          ...editingGroup,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      placeholder={`Enter ${key
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()}`}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditingGroup(null);
                  setProfilePicPreview(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {loading ? (
                  <div className="flex justify-center items-center h-6 gap-2">
                    <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-6 h-6"></div>
                    Update
                  </div>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteGroupId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this group?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteGroupId(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div
              key={group._id}
              className="border p-3 rounded shadow flex gap-4 items-start justify-between"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={
                    group.profilePic?.startsWith("http")
                      ? group.profilePic
                      : `/uploads/groups/${group.profilePic}`
                  }
                  alt={group.groupName}
                  className="w-20 h-20 object-cover rounded-full border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{group.groupName}</h3>
                  <p>
                    <strong>Member Count:</strong> {group.memberCount}
                  </p>
                  <p>
                    <strong>Creator:</strong> {group.creator?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => handleEdit(group)}
                  className="px-3 py-1 text-green-800 rounded"
                  title="Edit Group"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => confirmDelete(group._id)}
                  className="px-3 py-1 text-red-600 rounded"
                  title="Delete Group"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No groups found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default GroupManager;
