import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader } from "lucide-react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/users/changePassword`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password changed successfully.");
      setTimeout(() => navigate("/user"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Password change failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none"
            />
          </div>
        </div>

       
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none"
            />
          </div>
        </div>

       
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "👀" : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {message && <p className="text-green-600 mb-4 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded bg-button text-white font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"
          }`}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
