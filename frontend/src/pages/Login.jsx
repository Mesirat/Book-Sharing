import React from "react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center justify-center  h-[100vh] bg-gray-200 border-2  p-4 shadow-md shadow-gray-900 rounded-md  ">
        <div className=" w-full flex  shadow-md shadow-gray-900 rounded-md mx-[200px]">
          <div className="w-1/2 flex flex-col justify-center items-center p-4 ">
            <div className="text-start">
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <p className="text-sm mb-6">
                Welcome back! Please login to your account
              </p>
            </div>
            <div className="text-start p-4 w-[70%]">
              <form action="" className="">
                <div className="">
                  <label
                    className="block text-md font-semibold text-gray-600 mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md p-2 outline-none"
                  />
                </div>
                <div className="">
                  <label
                    className="block font-semibold text-gray-600 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md p-2 outline-none mb-4"
                  />
                </div>
                <div className="text-end text-gray-600 hover:underline text-sm mb-4">
                  <a href="">Forget Password?</a>
                </div>
                <div className="text-center text-white bg-gray-900 p-1 rounded-md mb-4">
                  <button>Login</button>
                </div>
                <div className="flex justify-between">
                  <hr className=" flex-grow my-4 border-t-2 border-black " />
                  <div className="mx-2">or</div>
                  <hr className=" flex-grow my-4 border-t-2 border-black " />
                </div>
                <div className="text-center bg-white p-2 rounded-md">
                  <h2>Sign In with Google</h2>
                </div>
              </form>
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-center items-center">
            <h1>hi</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
