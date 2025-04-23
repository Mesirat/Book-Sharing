import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from 'lucide-react';
import { FaRegEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../store/authStore.js";
import axios from "axios";
import NavBar from "../components/NavBar.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, Loading } = useAuthStore();
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
      const result = await login(email, password);

      if (result) {
        navigate("/user");
      } 
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <>
    <NavBar/>
     <div className="font-serif text-white flex justify-center items-center min-h-screen bg-gray-100">
     
     <div className="relative w-full max-w-md mx-auto bg-opacity-90 bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12">
       <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
         <h1 className="text-3xl font-semibold text-center text-transparent bg-gradient-to-r from-[#0ef] to-[#c800ff] bg-clip-text mb-6">
           Welcome Back
         </h1>

         <div className="relative w-full">
           <div className="mb-4 flex items-center border-b-2 pb-2">
             <Mail className="text-black mr-3" />
             <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full border-none rounded-md text-lg text-black p-2 focus:outline-none"
               required
             />
           </div>
         </div>

         <div className="relative w-full">
           <div className="mb-4 flex items-center border-b-2 pb-2">
             <Lock className="text-black mr-3" />
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

         <Link to="/forgotPassword" className="text-black hover:underline mb-4">
           Forgot Password?
         </Link>

         {error && (
           <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
         )}

         <button
           type="submit"
           disabled={Loading}
           className={`w-full py-3 text-xl font-bold rounded-full ${
             Loading
               ? "bg-gradient-to-r from-[#0ef] to-[#3B5998] opacity-50 cursor-not-allowed"
               : "bg-gradient-to-r from-[#0ef] to-[#3B5998] hover:from-[#0ef] hover:to-[#ff66c4] transition duration-300"
           } text-white transform hover:scale-105`}
         >
           {Loading ? (
             <Loader className="w-6 h-6 animate-spin mx-auto" />
           ) : (
             "Sign In"
           )}
         </button>

         <p className="mt-6 text-sm text-gray-500">
           Don't have an account?
           <Link to="/signup" className="text-black font-bold hover:underline mx-2">
             Sign Up
           </Link>
         </p>
       </form>
     </div>
   </div>
    </>
 );
   
};

export default Login;
