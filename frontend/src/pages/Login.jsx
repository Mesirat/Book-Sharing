
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {LoaderCircle} from 'lucide-react'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setError("");
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login is not implemented yet.");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 p-4">
      <div className="flex lg:w-[35%] lg:px-12 md:[w-70%] sm:[80%] items-center bg-gray-300 shadow-md shadow-gray-900 rounded-md w-full  mx-auto">
        <div className="w-full  flex flex-col items-center  p-6">
          <h2 className="text-xl lg:text-3xl font-semibold mb-4 font-serif text-start ">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 rounded-3xl p-2 outline-none px-4"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-3xl p-2 px-4 outline-none "
                placeholder="Enter your password"
                required
              />
            </div>

          
            <div className=" flex justify-between text-end text-gray-800 text-md lg:text-sm mb-4">
              <div className=""></div>
              <a href="#" className="mr-4  hover:underline ">
                Forget Password?
              </a>
            </div>
            {error && <div className="text-red font-semibold">{error}</div>}
            <div className="text-center items-center mb-4 w-full mx-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="font-semibold w-full text-black bg-gray-100 py-2 rounded-3xl  hover:shadow-md hover:shadow-black  text-md"
              >
                {isLoading ? <LoaderCircle  className="animate-spin mx-auto"/>: "Login"}
              </button>
            </div>

          
  <div className=" flex justify-between text-sm mb-4 mr-3 ">
              <div className=""></div>
              <Link to={"/signup"}>
                Don't have an account? <span className="font-serif font-semibold">Sign Up</span>
              </Link>
            </div>
            <div
              onClick={handleGoogleLogin}
              className="flex justify-center items-center w-full mx-auto  py-2 bg-gray-100 hover:shadow-md hover:shadow-black  rounded-3xl cursor-pointer mb-4"
            >
              <FcGoogle className="w-6 h-6 mr-1" />
              <h2 className="text-md lg:text-md text-gray-700 font-semibold">
                Continue With Google
              </h2>
            </div>
           
          
          </form>
        </div>

      
      </div>
    </div>
  );
};

export default Login;
