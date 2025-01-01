import React from "react";

const Home = () => {
  return (
    <>
      <div className="w-full h-screen ">
        <div className="w-full h-full flex ">
          <div className="w-1/2 h-full  flex-row items-center  bg-green-600 items-center font-serif text-4xl">
            <h2 className="mb-2 text-4xl">
              The best books are meant to be shared. <br />{" "}
              <span>Let's discover, share, and inspire together.</span>{" "}
            </h2>
          </div>
          <div className="w-1/2 h-full bg-white ">
          <div className="flex flex-col items-center justify-center">

            <div className="flex justify-between">
            
              <img
                className="w-96 h-96"
                src="/assets/boy.png"
                alt="Man Pointing to the right"
              />
            </div>
            <div className="flex">
              <img
                className="w-96 h-96"
                src="/assets/manPointing.jpg"
                alt="Man Pointing to the right"
              />

              <img
                className="w-106 h-106"
                src="/assets/shouted.png"
                alt="Man Pointing to the right"
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
