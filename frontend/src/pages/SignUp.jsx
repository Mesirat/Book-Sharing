import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSignupMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import SideBar from "../components/SideBar";
const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(username,email, password);
  const [signup, { loading }] = useSignupMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <SideBar />

      <div className="reltive flex items-center justify-center h-screen bg-gray-200 p-4">
        <div className="flex lg:w-[35%]  md:w-[70%] sm:[80%] items-center bg-gray-300 shadow-sm shadow-gray-400 rounded-2xl w-full  mx-auto">
          <div className="w-full  flex flex-col items-center  px-2 py-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-center lg:text-start">
              Sign Up
            </h2>
            <form
              onSubmit={handleSignup}
              className="w-full max-w-md lg:w-4/5  "
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
                >
                  User Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md p-2 outline-none mb-4"
                  placeholder="Enter your first name"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
             
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  className="w-full rounded-md p-2 outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md p-2 outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-end mt-4">
                <p className="text-xs lg:text-sm">
                  Already have an account?{" "}
                  <a
                    href=""
                    className="text-gray-700 font-semibold hover:underline"
                  >
                    Log In
                  </a>
                </p>
              </div>
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="w-cover font-semibold px-1 lg:w-[35%] text-white bg-gray-900 py-2 rounded-md  hover:shadow-md hover:shadow-white hover:rounded-3xl"
                >
                  {loading ? <LoaderCircle /> : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
