// import { useState } from 'react';
// import axios from 'axios';
// import { FcApproval } from 'react-icons/fc';
// import { MdEmail } from 'react-icons/md';
// import { RiLockPasswordFill } from 'react-icons/ri';
// import { Link } from 'react-router-dom';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:5000/login', {
//                 email,
//                 password,
//             });

//             console.log(response.data);
//             setSuccess(true);
//             setError('');
//             localStorage.setItem('token', response.data.token);
//         } catch (error) {
//             console.error(error);
//             setError(error.response?.data?.message || 'Invalid credentials');
//             setSuccess(false);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

//                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//                 {success && (
//                     <p className="text-green-500 font-bold text-lg text-center mb-4 flex justify-center items-center gap-2">
//                         <FcApproval size={24} /> Login Successful
//                     </p>
//                 )}

//                 <div className="mb-4 flex items-center border-b-2 pb-2">
//                     <MdEmail className="text-black mr-3" />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="bg-transparent border-none outline-none w-full text-black text-lg p-2"
//                         required
//                     />
//                 </div>

//                 <div className="mb-6 flex items-center border-b-2 pb-2">
//                     <RiLockPasswordFill className="text-black mr-3" />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="bg-transparent border-none outline-none w-full text-black text-lg p-2"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full py-3 mb-6 text-white text-xl font-semibold bg-gradient-to-r from-[#0ef] to-[#c800ff] rounded-full hover:bg-[#0ef] transition"
//                 >
//                     Submit
//                 </button>

//                 <p className="text-sm text-center">
//                     Don't have an account?{' '}
//                     <Link to="/signup" className="text-black hover:underline">Sign Up</Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from 'lucide-react';
import { FaRegEyeSlash } from "react-icons/fa";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore.js";
import SideBar from "../components/SideBar.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, Loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.log('Login Failed');
    }
  };

  return (
    <>
      {/* <SideBar /> */}
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
                  type="text"
                  placeholder="UserName"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full  border-none rounded-md text-lg text-black p-2 focus:outline-none"
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
                  className="w-full  border-none rounded-md text-lg text-black p-2 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black xl"
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
