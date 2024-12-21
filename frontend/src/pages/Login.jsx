import React from "react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center justify-center  h-[100vh] bg-gray-200 border-2  p-4 shadow-md shadow-gray-900 rounded-md  ">
        <div className=" w-full flex bg-gray-300  shadow-md shadow-gray-900 rounded-md mx-[200px]">
          <div className="w-1/2 flex flex-col justify-center items-center p-4 ">
            <div className="text-start">
              <h2 className="text-3xl font-bold mb-4 font-serif">Welcome Back</h2>
             
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
                <div className="text-end text-gray-500 hover:underline text-sm mb-4 px- font-semibold">
                  <a className="mr-4" href="">Forget Password ?</a>
                </div>
                <div className="text-center  mb-4">
                  <button className=" w-[60%] text-white bg-gray-900 p-2 rounded-md"> Login</button>
                </div>
                <div className="flex justify-between mb-4">
                  <hr className=" flex-grow my-4 border-t-2 border-black " />
                  <div className="mx-2">or</div>
                  <hr className=" flex-grow my-4 border-t-2 border-black " />
                </div>
                <div className="text-center ">
                  <h2 className="w-[60%] p-2 bg-white  hover:shadow-md hover:shadow-black rounded-md mx-auto">Sign In With Google</h2>
                </div>
              </form>
            </div>
          </div>
     
          <div className="w-1/2 flex flex-col rounded-md px-12">
         
         
            <img className='w-96 h-96 mt-24' src="/assets/lo.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
