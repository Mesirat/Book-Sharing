// import React, { useState } from "react";
// import SideBar from "../components/SideBar";
// import { Search, Bell } from "lucide-react";

// const Home = () => {
//   const [IsOpen, setIsOpen] = useState(false);
//   return (
//     <div className="flex w-full">

//         <SideBar setIsOpen={setIsOpen} IsOpen={IsOpen} />

//       <div
//         className={`flex flex-col w-full transition-all duration-1 ease-in-out ${
//           IsOpen ? "ml-48" : "ml-14"
//         }`}
//       >
//         <div className="flex  justify-between items-center bg-white p-4 mr-6">
//           <div className="flex items-center space-x-6">
//             <div className="flex cursor-pointer">
//               <h2 className="font-bold text-2xl text-black"></h2>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2 w-[350px] bg-gray-50 h-10 justify-between items-center border-2 rounded-3xl shadow-lg">
//             <input
//               type="text"
//               placeholder="Search Books"
//               className="w-full bg-gray-50 h-8 px-4 ml-2 border-none rounded-md focus:border-transparent focus:outline-none focus:ring-0"
//             />
//             <button className="w-8 h-8 border-l-2 p-2 flex items-center justify-center">
//               <Search />
//             </button>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative cursor-pointer hover:bg-gray-200 hover:rounded-full p-1 w-10 h-10">
//               <Bell className="text-gray-600 w-7 h-7" />
//               <div className="absolute top-[-2px] right-[3px] bg-red-600 w-5 h-5 rounded-full border-white border-2 flex items-center justify-center">
//                 <span className="text-xs font-medium text-white">1</span>
//               </div>
//             </div>
//             <div
//               className="flex items-center justify-center w-10 h-10 text-white rounded-full border-2 border-gray-600 cursor-pointer hover:border-green-500"
//               style={{ backgroundColor: "#502FA2" }}
//             >
//               <span className="text-xl font-semibold">N</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col  p-6">
//           <h1 className="text-3xl font-semibold">Welcome to Bookish!</h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import { Search, Bell } from "lucide-react";

const Home = () => {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <SideBar setIsOpen={setIsOpen} IsOpen={IsOpen} />

      {/* Main Content */}
      <div
        className={`flex flex-col w-full transition-all duration-3 ease-in-out ${
          IsOpen ? "" : "ml-6"
        }`}
      >
        {/* Main Content */}
        <div className="flex flex-col p-6 mt-20">
          <h1 className="text-3xl font-semibold">Welcome to Bookish!</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
