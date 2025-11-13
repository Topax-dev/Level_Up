"use client"

import { GetParamsNumber } from "@/utils/mainUtils";
import React from "react";

const PipePathCourse = () => {
  const id = GetParamsNumber('pathId')
  console.log(id)
  return (
    <div className="min-h-screen py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">
          Add New Pipe Path & Course
        </h1>
      </div>
    </div>
  );
};

export default PipePathCourse;
