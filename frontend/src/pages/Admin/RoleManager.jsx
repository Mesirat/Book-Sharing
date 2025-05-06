import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Slash, Undo, Trash2, Pencil, Check, TriangleAlert } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
const token = useAuthStore.getState().token;
  const API = "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const toggleSuspend = async (id, currentStatus) => {
    try {
      await axios.put(
        `${API}/admin/suspend/${id}`,
        { isSuspended: !currentStatus },
        {
          headers: {
            withCredentials: true, 
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error toggling suspension:", err);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.put(
        `${API}/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: {
            withCredentials: true, 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API}/admin/users/${id}`, {
        headers: {
          withCredentials: true, 
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
      />

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`bg-white p-4 rounded-xl shadow flex items-center justify-between ${
                user.isSuspended ? "opacity-70 bg-red-50" : ""
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={user.profile || "/default-profile.png"}
                  alt={user.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{user.firstName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-48">
                <label className="text-sm text-gray-700">Role:</label>
                {editingUserId === user._id ? (
                  <>
                    <select
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="text-sm border px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                   
                  </>
                ) : (
                  <span className="text-sm capitalize text-blue-500">
                    {user.role}
                  </span>
                )}
              </div>

              <div className="w-32 text-sm font-medium">
                {user.isSuspended ? (
                  <span className="text-red-500">Suspended</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </div>

              <div className="flex gap-3 w-32 justify-end">
                {editingUserId === user._id ? (
                  
                    <button
                      onClick={() => {
                        updateRole(user._id, editedRole);
                      }}
                      className="text-green-600 hover:text-green-800"
                      title="Save Role"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    ):(
                      <button
                      onClick={() => {
                        setEditingUserId(user._id);
                        setEditedRole(user.role);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Role"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                
               
                <button
                  onClick={() => toggleSuspend(user._id, user.isSuspended)}
                  className={`${
                    user.isSuspended
                      ? "text-green-600 hover:text-green-800"
                      : "text-yellow-600 hover:text-yellow-800"
                  }`}
                  title={user.isSuspended ? "Undo Suspend" : "Suspend Account"}
                >
                  {user.isSuspended ? (
                    <Undo className="w-5 h-5" />
                  ) : (
                    <TriangleAlert className="w-5 h-5"/>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete User"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
