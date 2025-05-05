import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader } from "lucide-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
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
      const response = await axios.put(
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

      setMessage("✅ Password changed successfully.");
      setTimeout(() => navigate("/user"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Current password is incorrect."
          : "Password change failed.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded text-sm">
            {message}
          </div>
        )}

        {[
          {
            label: "Current Password",
            value: currentPassword,
            onChange: setCurrentPassword,
          },
          {
            label: "New Password",
            value: newPassword,
            onChange: setNewPassword,
          },
          {
            label: "Confirm New Password",
            value: confirmPassword,
            onChange: setConfirmPassword,
          },
        ].map(({ label, value, onChange }, index) => (
          <div className="mb-5" key={index}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {label}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {index === 2 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600 text-white cursor-not-allowed"
              : "bg-gray-800 hover:bg-secondary text-white"
          }`}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
