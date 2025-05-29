import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader, User } from "lucide-react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore.js";
import NavBar from "../../components/headers/bars/NavBar.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { login, loading: Loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password, isAdmin);

      if (result) {
        if (result.mustChangePassword === true) {
         navigate("/changePassword"); 
        } else if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err) {
      let message = "Login failed. Please try again.";
      const status = err?.response?.status;

      if (status === 401) {
        message = "Invalid credentials. Please check your username and password.";
      } else if (status === 429) {
        message = "Too many login attempts. Please try again later.";
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="font-serif  flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-md mx-auto bg-opacity-90 bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            <h1 className="text-3xl font-semibold text-center text-secondary  mb-6">
              Welcome Back
            </h1>

            <div className="relative w-full">
              <div className="mb-4 flex items-center border-b-2 pb-2">
                <User className="text-secondary mr-3" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative w-full">
              <div className="mb-4 flex items-center border-b-2 pb-2">
                <Lock className="text-secondary mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
                >
                  {showPassword ? "👀" : <FaRegEyeSlash />}
                </button>
              </div>
            </div>


            {error && (
              <p className="text-red-500 text-center font-semibold mb-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={Loading}
              className={`bg-secondary text-white w-full py-3 text-lg font-bold rounded-2xl ${
                Loading
                  ? " opacity-50 cursor-not-allowed"
                  : " transition duration-300"
              }  transform hover:bg-secondary `}
            >
              {Loading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </button>

           
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
