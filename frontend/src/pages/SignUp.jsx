import React from 'react'
import { FcGoogle } from "react-icons/fc";
const SignUp = () => {
  return (
    < div>
     <div className="flex items-center justify-center  h-[100vh] bg-gray-200 border-2  p-4 shadow-md shadow-gray-900 rounded-md  ">
    <div className=" w-full flex bg-gray-300  shadow-md shadow-gray-900 rounded-md mx-[200px]">
      <div className="w-2/3 flex flex-col justify-center items-center p-4 ">
        <div className="text-start">
          <h2 className="text-3xl font-bold mb-4 font-serif">Sign Up</h2>
         
        </div>
        <div className="text-start p-4 w-[70%]">
          <form action="" className="">
        
            <div className=" flex justify-center items-center w-[60%] p-2 bg-white  hover:shadow-md hover:shadow-black rounded-md mx-auto mb-2 cursor-pointer">
            <FcGoogle className='w-6 h-6 mr-2 '/>
              <h2 className="text-center"> Sign In With Google</h2>
            </div> 
            <div className="flex justify-between mb-4">
              <hr className=" flex-grow my-4 border-t-2 border-black " />
              <div className="mx-2">or</div>
              <hr className=" flex-grow my-4 border-t-2 border-black " />
            </div>
            <div className=" flex justify-between">
          

          <div className="mr-4"> 
              <label
                className="block text-md font-semibold text-gray-600 mb-2"
                htmlFor="firstname"
              >
                FirstName
              </label>
              <input
                type="text"
                className="w-full rounded-md p-2 outline-none mb-4"
              />
            </div>
            <div className="">
              <label
                className="block text-md font-semibold text-gray-600 mb-2"
                htmlFor="fnamlast"
              >
                LastName
              </label>
              <input
                type="text"
                className="w-full rounded-md p-2 outline-none mb-4"
              />
            </div>
            </div>
            <div className="">
              <label
                className="block text-md font-semibold text-gray-600 mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="text"
                className="w-full rounded-md p-2 outline-none mb-4"
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
            <div className="text-end mr-4 mb-4">
            <p className='text-sm'>Already have an Account ? <a href='' className='text-600 font-serif font-semibold text-gray-700 hover:underline'>Log In</a></p> 
          </div>
            <div className="text-center  mb-4">
              <button className=" w-[60%] text-white bg-gray-900 p-2 rounded-md">Sign Up</button>
            </div>
         
          </form>
        </div>
      </div>
 
      <div className="w-1/3 flex flex-col rounded-md mt-[110px]">
     
     
        <img className='w-104 h-104 ' src="/assets/lo.png" alt="" />
      </div>
    </div>
  </div>


    </div>
  )
}

export default SignUp