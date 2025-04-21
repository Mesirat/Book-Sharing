import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import Input from "../components/Input.jsx";
import toast from "react-hot-toast";
import { Lock, Loader } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, Loading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Error resetting password");
    }
  };

  return (
    <div className="w-full h-screen font-serif text-white flex items-center justify-center bg-gradient-to-r from-[#1a2740] to-[#081b29]">
      <div className="relative w-full max-w-md mx-auto bg-opacity-90 bg-[#081b29] rounded-lg shadow-xl p-8 sm:p-10 md:p-12">
        <h2 className="text-3xl font-semibold text-center text-transparent bg-gradient-to-r from-[#0ef] to-[#c800ff] bg-clip-text mb-6">
          Reset Password
        </h2>
        
        {/* Error or Success Messages */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            disabled={Loading}
            className={`w-full mt-4 py-3 text-xl font-semibold text-center rounded-full transition-all ${
              Loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0ef] to-[#c800ff] hover:from-[#0ef] hover:to-[#ff66c4] transition duration-300"
            }`}
          >
            {Loading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
