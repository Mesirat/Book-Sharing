import { useState } from "react";
import Categories from "../components/Categories";
import Recommendation from "./Recommendation";
import {useSelector} from 'react-redux'
// import Footer from "../components/Footer";
import Contact from "./Contact";
import SideBar from "../components/SideBar";

function Home1() {
const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="h-full w-full font-serif">
    
      <SideBar/>

      {/* Hero Section */}
      <div className="bg-[url('/assets/32.jpg')] bg-cover bg-center h-screen flex flex-col items-start justify-center px-4 sm:px-10 lg:px-24 text-left">
        <div className="mt-8 sm:mt-12">
          <p className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Reading gives us
          </p>
          <p className="text-2xl sm:text-4xl lg:text-6xl text-yellow-300 font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
            someplace to go
          </p>
          <p className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
            when we have to stay
          </p>
          <p className="text-2xl sm:text-4xl lg:text-6xl text-yellow-300 font-bold leading-tight">
            where we are.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="mx-4 sm:mx-8 lg:mx-24 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
          <div className="text-center md:text-left">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">
              Deciding what to read next?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg">
              You’re in the right place. Tell us what titles or genres you’ve
              enjoyed in the past, and we’ll give you surprisingly insightful
              recommendations.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">
              What are your friends reading?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg">
              Chances are your friends are discussing their favorite (and least
              favorite) books on Bookish.
            </p>
          </div>
        </div>
      </div>

    {userInfo ? (
 <Recommendation />

    ):("")
  }
{/*       
      <div className="flex flex-col items-center mt-12 sm:mt-16">
        <Categories />
      </div>
     */}
     

      {/* Contact Section */}
      <div className="flex flex-col items-center mt-6 sm:mt-12 mb-16">
        <Contact />
      </div>

      {/* Footer
      <Footer /> */}
    </div>
  );
}

export default Home1;
