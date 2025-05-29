import { useEffect, useState } from "react";
import api from "../../Services/api";
import {
  Slash,
  Undo,
  Trash2,
  Pencil,
  Check,
  TriangleAlert,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { toast, ToastContainer } from "react-toastify";

const UserManagement = () => {
  const token = useAuthStore((state) => state.token);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.put(
        `/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const toggleSuspend = async (id, currentStatus) => {
    try {
      await api.put(
        `/admin/suspend/${id}`,
        { isSuspended: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, isSuspended: !currentStatus }
            : user
        )
      );
    } catch (err) {
      console.error("Error toggling suspension:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await api.put(`/admin/users/${id}/resetPassword`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password has been reset to: 12345678");
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Failed to reset password.");
    }
  };

  const openConfirmModal = ({ title, onConfirm }) => {
    setModalData({ title, onConfirm });
    setModalOpen(true);
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
        className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`bg-white p-4 md:p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 ${
                user.isSuspended ? "opacity-70 bg-red-50" : "hover:shadow-lg"
              }`}
            >
              <div className="flex items-start md:items-center gap-4 flex-1 mb-4 md:mb-0">
                <img
                  src={user.profileImage || "/default-profile.png"}
                  alt={user.firstName}
                  className="w-14 h-14 rounded-full object-cover shadow"
                />
                <div>
                  <h3 className="font-semibold text-lg">{user.firstName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <label className="text-sm text-gray-700 font-medium">
                      Role:
                    </label>
                    {editingUserId === user._id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="text-sm border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-sm capitalize text-blue-500 font-medium">
                        {user.role}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 w-32 text-sm font-medium">
                    {user.isSuspended ? (
                      <span className="text-red-500">Suspended</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 items-end mr-6">
                {editingUserId === user._id ? (
                  <button
                    onClick={() => updateRole(user._id, editedRole)}
                    className="text-green-600 hover:text-green-800 transition-transform hover:scale-110"
                    title="Save Role"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingUserId(user._id);
                      setEditedRole(user.role);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                    title="Edit Role"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() =>
                    toggleSuspend(user._id, user.isSuspended)
                  }
                  className={`transition-transform hover:scale-110 ${
                    user.isSuspended
                      ? "text-green-600 hover:text-green-800"
                      : "text-yellow-600 hover:text-yellow-800"
                  }`}
                  title={user.isSuspended ? "Undo Suspend" : "Suspend Account"}
                >
                  {user.isSuspended ? (
                    <Undo className="w-5 h-5" />
                  ) : (
                    <TriangleAlert className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() =>
                    openConfirmModal({
                      title: "Are you sure you want to delete this user?",
                      onConfirm: () => handleDelete(user._id),
                    })
                  }
                  className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                  title="Delete User"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    openConfirmModal({
                      title:
                        "Reset this user's password to default (12345678)?",
                      onConfirm: () => handleResetPassword(user._id),
                    })
                  }
                  className="text-purple-600 hover:text-purple-800 transition-transform hover:scale-110"
                  title="Reset Password"
                >
                  <Slash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {modalData.title}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modalData.onConfirm();
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserManagement;
