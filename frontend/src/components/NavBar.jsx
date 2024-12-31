import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <div className=" bg-gray-900 h-12 z-12 px-4">
        <div className="flex w-full justify-between font-serif font-semibod p-2 text-white items-center">
          <div className="w-1/3 mx-auto">
            <h2 className="font-serif font-bold  text-2xl">Bookish</h2>
          </div>
          <div className="grid grid-cols-4 w-2/3 text-xl">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/categories"}>Categories</Link>
            <Link to={"/contactus"}>Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;