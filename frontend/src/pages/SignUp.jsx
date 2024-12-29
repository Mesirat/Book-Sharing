import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSignupMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
const SignUp = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(firstname, lastname, email, password);
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
        firstname,
        lastname,
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
    <div className="flex items-center justify-center h-screen bg-gray-200 p-4">
      <div className="flex lg:w-[35%] lg:px-12 md:w-[70%] sm:[80%] items-center bg-gray-300 shadow-md shadow-gray-900 rounded-md w-full  mx-auto">
        <div className="w-full  flex flex-col items-center  p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-center lg:text-start">
            Sign Up
          </h2>
          <form onSubmit={handleSignup} className="w-full max-w-md lg:w-4/5">
            {/* <div className="flex justify-center items-center w-cover mx-24 shadow-md shadow-gray-600  py-2 bg-white hover:shadow-md hover:shadow-black hover:rounded-3xl rounded-md cursor-pointer mb-4">
              <FcGoogle className="w-6 h-6 mr-2" />
              <h2 className="text-sm lg:text-md font-semibold">Sign Up With Google</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <hr className="flex-grow border-t-2 border-gray-500" />
              <div className="mx-2 text-gray-500">or</div>
              <hr className="flex-grow border-t-2 border-gray-500" />
            </div> */}
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
                  placeholder="Enter your first name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
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
                  placeholder="Enter your last name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
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
                className="w-cover font-semibold px-12 lg:w-[35%] text-black bg-white py-2 rounded-md shadow-md shadow-gray-600 hover:shadow-md hover:shadow-black hover:rounded-3xl"
              >
                {loading ? <LoaderCircle /> : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
        {/* <div className="hidden lg:inline lg:w-1/3 flex justify-center items-center  mt-32 ">
          <img
            className="w-60 lg:w-80 object-contain "
            src="/assets/lo.png"
            alt="Sign Up Illustration"
          />
        </div> */}
      </div>
    </div>
  );
};
export default SignUp;
// import React, { useState } from "react";
// import { FcGoogle } from "react-icons/fc";

// const SignUp = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log(firstName, lastName, email, password);
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-200 p-4">
//       <div className="flex flex-col lg:flex-row bg-gray-2500 shadow-md shadow-gray-800 rounded-xl w-full max-w-5xl mx-4 md:mx-[100px]">
//         {/* Form Section */}
//         <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-6 px-12">
//           <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-center lg:text-start">
//             Sign Up
//           </h2>
//           <form onSubmit={handleSignup} className="w-full max-w-md lg:w-4/5">
//             {/* Google SignUp Button */}
//             <div className="flex justify-center items-center w-full shadow-md shadow-gray-600 py-2 bg-white hover:shadow-md hover:shadow-black hover:rounded-3xl rounded-md cursor-pointer mb-4">
//               <FcGoogle className="w-6 h-6 mr-2" />
//               <h2 className="text-sm lg:text-md font-semibold">Sign Up With Google</h2>
//             </div>

//             {/* Or Divider */}
//             <div className="flex items-center justify-between mb-4">
//               <hr className="flex-grow border-t-2 border-gray-500" />
//               <div className="mx-2 text-gray-500">or</div>
//               <hr className="flex-grow border-t-2 border-gray-500" />
//             </div>

//             {/* First and Last Name Inputs */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="firstname"
//                   className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
//                 >
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full rounded-md p-2 outline-none"
//                   onChange={(e) => setFirstName(e.target.value)}
//                   placeholder="Enter your first name"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="lastname"
//                   className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
//                 >
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full rounded-md p-2 outline-none"
//                   onChange={(e) => setLastName(e.target.value)}
//                   placeholder="Enter your last name"
//                 />
//               </div>
//             </div>

//             {/* Email Input */}
//             <div className="mt-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 className="w-full rounded-md p-2 outline-none"
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="mt-4">
//               <label
//                 htmlFor="password"
//                 className="block text-sm lg:text-md font-semibold text-gray-600 mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="w-full rounded-md p-2 outline-none"
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//             </div>

//             {/* Existing User Login Link */}
//             <div className="text-end mt-4">
//               <p className="text-xs lg:text-sm">
//                 Already have an account?{" "}
//                 <a
//                   href="#"
//                   className="text-gray-700 font-semibold hover:underline"
//                 >
//                   Log In
//                 </a>
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="text-center mt-6">
//               <button
//                 type="submit"
//                 className="w-full lg:w-[35%] font-semibold px-12 text-black bg-white py-2 rounded-md shadow-md shadow-gray-600 hover:shadow-md hover:shadow-black hover:rounded-3xl"
//               >
//                 Sign Up
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Image Section (Only for Larger Screens) */}
//         <div className="hidden lg:inline lg:w-1/3 flex justify-center items-center mt-32">
//           <img
//             className="w-60 lg:w-80 object-contain"
//             src="/assets/lo.png"
//             alt="Sign Up Illustration"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
