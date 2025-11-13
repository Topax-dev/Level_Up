import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300">
        <div className="flex flex-col justify-center h-dvh items-center lg:flex-row">
          <div className="text-center flex flex-col gap-10 items-center">
            <h2 className="text-4xl lg:w-4/6 font-medium lg:text-5xl ">
              Explore, Evolve & Make an Impact with{" "}
              <span className="text-yellow-700">LEVEL UP</span> by Amoeba
            </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-5/6 lg:w-3/6 flex justify-center">
                Our full stack curriculum is free and supported by a passionate
                open source community.
              </p>
            <Link href="/paths" className="w-full flex justify-center">
              <h3 className="mt-7 border border-gray-600 rounded-md px-6 py-3 lg:px-10 lg:py-4 dark:hover:bg-gray-800 cursor-pointer">
                View Full Curicullum
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
