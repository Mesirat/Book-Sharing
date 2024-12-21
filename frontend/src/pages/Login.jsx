import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 p-4">
      <div className="flex flex-col lg:flex-row bg-gray-300 shadow-md shadow-gray-900 rounded-md w-full max-w-5xl mx-4 lg:mx-0">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-center lg:text-start">
            Welcome Back
          </h2>
          <form className="w-full max-w-md ">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                type="text"
                className="w-full rounded-md p-2 outline-none"
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
                className="w-full rounded-md p-2 outline-none"
              />
            </div>
            <div className="text-end text-gray-500 hover:underline text-xs lg:text-sm mb-4">
              <a href="" className="mr-4">
                Forget Password?
              </a>
            </div>
            <div className="text-center mb-4">
              <button className="w-cover px-20 bg-gray-900 text-white py-2 rounded-md">
                Login
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <hr className="flex-grow border-t-2 border-gray-500" />
              <div className="mx-2 text-gray-500">or</div>
              <hr className="flex-grow border-t-2 border-gray-500" />
            </div>
            <div className="flex justify-center items-center w-cover mx-24 py-2 bg-white hover:shadow-md hover:shadow-black rounded-md cursor-pointer mb-4">
              <FcGoogle className="w-6 h-6 mr-2" />
              <h2 className="text-sm lg:text-md">Sign Up With Google</h2>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-6">
          <img
            src="/assets/lo.png"
            alt="Login Illustration"
            className="w-72 h-72 lg:w-96 lg:h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
