import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader } from "lucide-react";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore.js";
import NavBar from "../../components/headers/bars/SideBar.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { Loading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending reset link:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="font-serif text-white flex justify-center items-center min-h-screen bg-gray-300">
        <div className="relative w-full max-w-md mx-auto bg-gray-200 rounded-lg shadow-lg p-8 sm:p-10 md:p-12">
          <h2 className="text-3xl font-semibold text-center text-black mb-6">
            Forgot Password
          </h2>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-black mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <Input
                icon={Mail}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={Loading}
                className={`w-full mt-4 py-3 text-xl font-semibold text-white text-center rounded-full transition-all ${
                  Loading
                    ? "bg-gradient-to-r from-[#0ef] to-[#3B5998] opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0ef] to-[#3B5998] hover:from-[#0ef] hover:to-[#ff66c4] transition duration-300"
                }`}
              >
                {Loading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <Mail className="text-black mx-auto h-9 w-9 mb-2" />
              <p className="text-center text-black mb-6">
                If an account exists for "{email}", you will receive a password reset link soon.
              </p>
            </div>
          )}

          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <Link
              to="/login"
              className="text-sm text-white hover:underline flex items-center"
            >
              <span className="w-6 h-6 mx-auto">←</span> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
