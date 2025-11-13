"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { BookOpen, Wrench } from "lucide-react";
import { ICourse } from "@/interface/iAll";
import axios from "axios";
import Link from "next/link";
import { formatHyphen } from "@/utils/mainUtils";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user);
  const [course, setCourse] = useState<ICourse[]>();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [pathTitle, setPathTitle] = useState<string>("");

  useEffect(() => {
    setIsClient(true);

    const getCourse = async () => {
      if (!user?.selectedPath) {
        try {
          const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/default/course`;
          const response = await axios.get(url);
          const obj = response.data[0].payload.pathCourses;
          const id = response.data[0].payload.pathCourses[0].pathId;
          setPathTitle("Foundations");
          await axios.patch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/path/${user.id}`,
            { selectedPath: id },
            { withCredentials: true }
          );
          return setCourse(obj);
        } catch (error) {
          return console.log(error);
        }
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/course/${user.selectedPath}/${user.id}`;
        const response = await axios.get(url);
        console.log(response);
        const obj = response.data[0].payload.pathCourses;
        const path = response.data[0].payload.name;
        setPathTitle(path);
        setCourse(obj);
      } catch (error) {
        console.error("Error saat fetch course:", error);
      }
    };

    getCourse();
  }, [user?.selectedPath, user.id]);

  function getCircleProgress(completedLesson = 0, totalLessons = 0) {
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const progress =
      totalLessons > 0
        ? Math.max(0, Math.min(1, completedLesson / totalLessons))
        : 0;
    const dash = +(progress * circumference).toFixed(3);
    const gap = +(circumference - dash).toFixed(3);

    return { dash, gap };
  }

  if (!isClient) return null;

  return (
    <div className="py-10 flex flex-col gap-5 px-5 md:px-30 lg:px-40 xl:px-70">
      <div className="mb-5">
        <h1 className="text-center text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="flex justify-center mb-10">
        <div className="w-full min-h-32 dark:bg-gray-700/30 bg-white border dark:border-gray-700 border-gray-200 rounded-lg flex flex-col md:flex-row items-center p-7 gap-5">
          <div className="md:mr-5">
            <Image
              src={
                user.avatar && user.avatar.trim() !== ""
                  ? user.avatar
                  : `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/defaultAvatar.png`
              }
              width={100}
              height={100}
              className="w-22 h-22 rounded-full"
              alt="Foto Avatar"
            />
          </div>
          <div className="md:flex-1">
            <h2 className="text-2xl font-medium dark:text-gray-300 text-gray-700">
              {user.username || "Not Logged In Yet"}
            </h2>
          </div>
          <div className="text-md text-gray-600 dark:text-gray-300 md:flex-1">
            {user.purpose && user.purpose.trim() !== ""
              ? user.purpose
              : "What's your learning goal?"}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2 flex flex-col items-center">
          <div className="text-gray-700 text-2xl font-medium mb-2 dark:text-gray-300">
            Skill Progress
          </div>
          <div className="text-gray-500 dark:text-gray-500 font-medium text-center">
            The following courses should be taken in order
          </div>
        </div>
        <div>
          {course?.map((e) => {
            const { dash, gap } = getCircleProgress(
              e.course.completedLesson,
              e.course.totalLessons
            );

            return (
              <div
                className="flex gap-5 items-center flex-col md:flex-row justify-between px-4 py-8 border-b border-gray-300 dark:border-gray-700"
                key={e.course.id}
              >
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Link
                    href={`/paths/${formatHyphen(
                      pathTitle
                    )}/courses/${formatHyphen(e.course.title)}`}
                  >
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24" viewBox="0 0 36 36">
                        <path
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke="#009B9B"
                          strokeWidth={`${e.course.completedLesson === 0 ? '0' : '2'}`}
                          strokeDasharray={`${dash} ${gap}`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold dark:text-gray-400 text-gray-600 flex-col gap-1">
                        <div className="text-xs">
                          {e.course.completedLesson > 0 ? (
                            <>
                              {Math.round(
                                (e.course.completedLesson /
                                  e.course.totalLessons) *
                                  100
                              )}
                              %
                            </>
                          ) : (
                            <>0%</>
                          )}
                        </div>
                        <div className="text-xs">Complete</div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/paths/${formatHyphen(
                        pathTitle
                      )}/courses/${formatHyphen(e.course.title)}`}
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-400 text-center md:text-start">
                        {e.course.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-gray-500 flex gap-3 justify-center md:justify-start">
                      <div className="flex gap-1 items-center">
                        <BookOpen size={20} />
                        <div className="text-md font-medium">
                          {e.course.readingCount} Lessons
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Wrench size={20} />
                        <div className="text-md font-medium">
                          {e.course.projectCount} Project
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/paths/${formatHyphen(
                    pathTitle
                  )}/courses/${formatHyphen(e.course.title)}`}
                >
                  <button className="button border font-medium text-md border-gray-400 dark:border-gray-600 min-w-30 py-2 rounded-md cursor-pointer">
                    { e.course.completedLesson > 0 ? 'Resume' : 'Start' }
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
