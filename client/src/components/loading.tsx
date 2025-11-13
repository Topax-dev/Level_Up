"use client"

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const { show } = useSelector((state: RootState) => state.loading)

  if(!show) return null
  return (
    <div className="dark:bg-gray-900 bg-gray-100 z-50 fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 border-r-orange-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>

        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 shadow-lg shadow-blue-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full -translate-x-1/2 shadow-lg shadow-purple-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '2s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-pink-500 rounded-full -translate-x-1/2 shadow-lg shadow-pink-500/50"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="absolute mt-40">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Loading
          </span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;