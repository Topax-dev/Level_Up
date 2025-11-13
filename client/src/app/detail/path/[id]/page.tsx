"use client";

import { IDetailPath } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import { formatHyphen } from "@/utils/mainUtils";
import axios from "axios";
import { Book, Route, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const DetailPath = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [notFound, setNotFound] = useState(true);
  const [path, setPath] = useState<IDetailPath>();
  useEffect(() => {
    const getDetailPath = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/${id}`
        );
        if (!response.data[0].payload) {
          router.push("/");
          return dispatch(showNotif({ message: "Id Invalid", type: "info" }));
        }
        setNotFound(false);
        setPath(response.data[0].payload);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getDetailPath();
  }, [dispatch, id, router]);
  if (notFound) return null;
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {path ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Route size={30} strokeWidth={2} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Path Details
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore comprehensive information about this path
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full overflow-hidden p-8">
                  <div className="absolute inset-0 bg-gray-300/10 dark:bg-black/10"></div>
                  <Image
                    width={600}
                    height={600}
                    alt={path.name}
                    src={path.imagePath}
                    className="w-full h-full md:object-cover object-contain hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 dark:text-white shadow-lg">
                      Featured Path
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 cursor-pointer">
                    <Link href={"/all/paths"}>
                      <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 dark:text-white shadow-lg">
                        Back
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-between gap-5">
                  <div>
                    <h2 className="sm:text-3xl text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {path.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {path.description}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 text-center cursor-pointer flex-1">
                        <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
                          {path.pathCourses.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 ">
                          Courses
                        </div>
                      </div>
                      <Link
                        href={`/paths/${formatHyphen(path.name)}`}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 text-center cursor-pointer flex-1 flex items-center justify-center py-4"
                      >
                        <div className="flex gap-3 items-center">
                          <Book />
                          <div className="text-xl font-medium">View Paths</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Route size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Associated Courses
                </h3>
              </div>

              {path.pathCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {path.pathCourses.map((item, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl p-6 border border-gray-200 dark:border-gray-600/50 bg-gray-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <Link href={`/detail/course/${item.course.id}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Zap size={30} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {item.course.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Course
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-gray-600 dark:text-gray-400">
                    No Course available for this path yet
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DetailPath;
