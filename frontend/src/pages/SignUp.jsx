import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
const SignUp = () => {

const [firstName,setFirstName]= useState('');
const [lastName,setLastName]=useState('')
const [email,setEmail]=useState('')
const [password,setPassword]=useState('');

const handleLogin=(e)=>{
  e.preventDefault()
  console.log(firstName,lastName,email,password)

}



  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 p-4">
      <div className="flex flex-col lg:flex-row bg-gray-2500 shadow-md shadow-gray-800 rounded-xl w-full max-w-5xl mx-[100px]  md:mx-[200px]">
        <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-6  px-12 ">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-center lg:text-start">
            Sign Up
          </h2>
          <form onSubmit={handleLogin} className="w-full max-w-md lg:w-4/5">
            <div className="flex justify-center items-center w-cover mx-24 shadow-md shadow-gray-600  py-2 bg-white hover:shadow-md hover:shadow-black hover:rounded-3xl rounded-md cursor-pointer mb-4">
              <FcGoogle className="w-6 h-6 mr-2" />
              <h2 className="text-sm lg:text-md font-semibold">Sign Up With Google</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <hr className="flex-grow border-t-2 border-gray-500" />
              <div className="mx-2 text-gray-500">or</div>
              <hr className="flex-grow border-t-2 border-gray-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md p-2 outline-none"
                  onChange={(e)=>setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md p-2 outline-none"
                  onChange={(e)=>setLastName(e.target.value)}
                />
              </div>
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
                onChange={(e)=>setEmail(e.target.value)}
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
                onChange={(e)=>setPassword(e.target.value)}
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
              <button type="submit" className="w-cover font-semibold px-12 lg:w-[35%] text-black bg-white py-2 rounded-md shadow-md shadow-gray-600 hover:shadow-md hover:shadow-black hover:rounded-3xl">
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="hidden lg:inline lg:w-1/3 flex justify-center items-center  mt-32 ">
          <img
            className="w-60 lg:w-80 object-contain "
            src="/assets/lo.png"
            alt="Sign Up Illustration"
          />
        </div>
      </div>
    </div>
  );
};
export default SignUp;
