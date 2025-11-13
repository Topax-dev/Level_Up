import Image from "next/image";
import React from "react";
import learnImage from "../../../public/imageLearn.png";
import buildImage from "../../../public/buildImage.png";
import connectImage from "../../../public/connectImage.png";

const Feature = () => {
  return (
      <div className="min-h-dvh">
        <div className="flex items-center flex-col gap-10 mb-15">
          <h3 className="text-4xl px-4 lg:px-52 font-medium lg:text-5xl">
            How It Works
          </h3>
          <p className="text-md lg:text-lg font-medium dark:text-gray-300 max-w-5/6 lg:w-4/6 flex justify-center text-center text-gray-600">
            This is the website we wish we had when we were learning on our own.
            We scour the internet looking for only the best resources to
            supplement your learning and present them in a logical order.
          </p>
        </div>
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto text-center">
          <div className="p-5 flex-1">
            <Image
              src={learnImage}
              className="w-28 inline"
              width={1000}
              alt="Learn"
            />
            <h1 className="font-medium text-xl mt-8 mb-4">Learn</h1>
            <div className="px-8 sm:px-16 md:px-0 dark:text-gray-400">
              <p>
                Learn from a curriculum with the best curated online tutorials,
                blogs, and courses.
              </p>
            </div>
          </div>
          <div className="p-5 flex-1">
            <Image
              src={buildImage}
              className="w-56 inline"
              width={1000}
              alt="Learn"
            />
            <h1 className="font-medium text-xl mt-8 mb-4">Build</h1>
            <div className="px-8 sm:px-16 md:px-0 dark:text-gray-400">
              <p>
                Build dozens of portfolio-worthy projects along the way, from simple scripts to full programs and deployed websites.
              </p>
            </div>
          </div>
          <div className="p-5 flex-1">
            <Image
              src={connectImage}
              className="w-48 inline"
              width={1000}
              alt="Learn"
            />
            <h1 className="font-medium text-xl mt-8 mb-4">Connect</h1>
            <div className="px-8 sm:px-16 md:px-0 dark:text-gray-400">
              <p>
                You re not alone. Learn and get help from our friendly community of beginner and experienced developers.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Feature;
