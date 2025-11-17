"use client";

import { IDetailSection } from "@/interface/iAll";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { BookOpen, Pen, Route, TvMinimal, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const DetailSection = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const id = params?.id as string;
  const [notFound, setNotFound] = useState(true);
  const [section, setSection] = useState<IDetailSection>();
  useEffect(() => {
    const getDetailSection = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section/${id}`
        );
        if (!response.data[0].payload) {
          router.push("/");
          return dispatch(
            showNotif({ message: "Id Is Invalid", type: "error" })
          );
        }
        setNotFound(false);
        setSection(response.data[0].payload);
      } catch (error) {
        console.log(error);
      }
    };
    getDetailSection();
  }, [id, dispatch, router]);
  if (notFound) return null;
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {section ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <BookOpen size={30} strokeWidth={2} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Section Details
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore comprehensive information about this section
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                    <BookOpen
                      size={28}
                      strokeWidth={2}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Section Title
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 rounded-lg border-gray-200 dark:border-gray-600/50 bg-gray-100/50 dark:bg-gray-700/50 border">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lessons
                    </p>
                    <p className="text-lg font-bold text-gray-600 dark:text-gray-400 text-center">
                      {section.lesson?.length || 0}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-lg border-gray-200 dark:border-gray-600/50 bg-gray-100/50 dark:bg-gray-700/50dark:border-gray-600/50 dark:bg-gray-700/50 border">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Course
                    </p>
                    <p className="text-lg font-bold text-gray-600 dark:text-gray-400 text-center">
                      {section.lessonCourse?.length || 0}
                    </p>
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
                  Associated Lesson
                </h3>
              </div>

              {section.lesson && section.lesson.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {section.lesson.map((item, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl p-6 border border-gray-200 dark:border-gray-600/50 bg-gray-100/50 dark:bg-gray-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <Link href={`/detail/lesson/${item.id}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            {item.type === "READING" ? (
                              <BookOpen size={30} strokeWidth={2} />
                            ) : item.type === "WATCH" ? (
                              <TvMinimal size={30} strokeWidth={2} />
                            ) : item.type === "PROJECT" ? (
                              <Wrench size={30} strokeWidth={2} />
                            ) : item.type === "QUIZ" ? (
                              <Pen size={30} strokeWidth={2} />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Lesson
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
                    No Lessons available for this course yet
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Route size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Associated Course
                </h3>
              </div>

              {section?.lessonCourse?.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {section?.lessonCourse.map((item, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl p-6 border border-gray-200 dark:border-gray-600/50 bg-gray-100/50 dark:bg-gray-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                              Learning Path
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
                    No learning paths available for this course yet
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

export default DetailSection;
