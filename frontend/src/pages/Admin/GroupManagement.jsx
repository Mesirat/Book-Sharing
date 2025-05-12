import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const GroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null); // For image preview

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      await api.delete(`/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchGroups();
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

      {editingGroup && (
        <div className="border p-4 mb-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-lg mb-2">Edit Group</h3>
          {Object.entries(editingGroup).map(([key, value]) => {
            if (["_id", "__v", "createdAt", "updatedAt", "members", "creator", "description", "memberCount","cloudinaryPublicId"].includes(key))
              return null;
            return (
              <div key={key} className="mb-2">
                <label className="block mb-1 font-medium capitalize">{key}</label>
                {key === "profilePic" ? (
                  <div>
                    {profilePicPreview && (
                      <img
                        src={profilePicPreview}
                        alt="Profile Preview"
                        className="w-20 h-20 object-cover rounded-full border mb-2"
                      />
                    )}
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditingGroup({ ...editingGroup, [key]: file });
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfilePicPreview(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, [key]: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Update
            </button>
            <button
              onClick={() => setEditingGroup(null)}
              className="px-4 py-1 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
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
                  <p><strong>Member Count:</strong> {group.memberCount}</p>
                  <p><strong>Creator:</strong> {group.creator?.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => handleEdit(group)}
                  className="px-3 py-1 text-green-800 rounded"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(group._id)}
                  className="px-3 py-1 text-red-600 rounded"
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
