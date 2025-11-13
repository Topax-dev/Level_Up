"use client";

import { ICourseOnly } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import {
  BookOpen,
  CircleArrowLeft,
  CircleArrowRight,
  ClipboardPenLine,
  Plus,
  School,
  Trash,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Course = () => {
  const dispatch = useDispatch<AppDispatch>();
  const idAdmin = useSelector((state: RootState) => state.admin.id);
  const [course, setCourse] = useState<ICourseOnly[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [popDelete, setPopDelete] = useState(false);
  const [idCourse, setIdCourse] = useState(0);
  useEffect(() => {
    const getCourse = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course`
        );
        const totalCourse = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course-count`
        );
        const allCourse = response.data[0].payload;
        setCourse(allCourse);
        setTotalPage(totalCourse.data[0].payload);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getCourse();
  }, [dispatch, load]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course?page=${page}&search=${search}`
      );
      setCourse(response.data[0].payload);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, page]);

  const handleDelete = async (id: number) => {
    if (!idCourse) return;
    try {
      const respose = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course/${id}`
      );
      if (respose.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Delete",
            explanation: `Delete course with title course ${respose.data[0].payload.title}`,
          }
        );
        setLoad(load + 1);
        setPopDelete(false);
        return dispatch(
          showNotif({ message: "Delete Course Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  return (
    <div className="py-10 xl:px-55 lg:px-40 md:px-5 px-4">
      <div>
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-center dark:text-gray-200 mb-3">
            All Course
          </h2>
          <p className="text-center dark:text-gray-400 text-gray-600">
            Manage and organize your learning materials
          </p>
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Link href={"/add/course"} className="md:w-auto w-full">
            <button className="flex itmes-center border justify-center gap-2 bg-white w-full dark:border-gray-600/50 border-gray-200 dark:bg-gray-800 py-3 px-5 cursor-pointer rounded-md">
              <Plus /> <div className="font-medium">Add New Course</div>
            </button>
          </Link>
          <div className="flex-4">
            <input
              type="text"
              name="search"
              placeholder="Search Courses by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border w-full rounded-md py-3 px-4 outline-none border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600/50 dark:text-gray-300 transition-all duration-200"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {course.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-gray-400 mb-4">
              <School size={64} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Courses Found
            </h2>
          </div>
        ) : (
          course.map((e) => (
            <div
              key={e.id}
              className="w-full relative border py-8 px-8 flex flex-col gap-5 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600/50"
            >
              <div className="absolute -top-4 right-4 flex gap-2">
                <Link href={`/update/course/${e.id}`}>
                  <button className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md">
                    <ClipboardPenLine
                      size={18}
                      className="dark:text-white text-black"
                    />
                  </button>
                </Link>
                <button
                  className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md"
                  onClick={() => {
                    setIdCourse(e.id);
                    setPopDelete(true);
                  }}
                >
                  <Trash size={18} className="dark:text-white text-black" />
                </button>
              </div>
              <div className="flex sm:items-center justify-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-7 sm:mb-3">
                  <Image
                    src={e.imageCourse}
                    alt="course"
                    width={400}
                    height={300}
                    className="max-w-24 max-h-24 p-2 rounded-full bg-gray-50 dark:bg-gray-700/50"
                  />
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl dark:text-gray-200 text-gray-800 font-medium text-center md:text-start">
                      {e.title}
                    </h2>
                    <div className="text-sm dark:text-gray-400 flex gap-2 justify-center sm:justify-start">
                      <div className="flex gap-1 items-center">
                        <BookOpen size={20} />
                        <div className="text-md font-medium">
                          {e.totalReadingCount} Lessons
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Wrench size={20} />
                        <div className="text-md font-medium">
                          {e.totalProjectCount} Project
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/detail/course/${e.id}`}>
                  <button className="button border border-gray-400 dark:border-gray-600 px-5 py-3 rounded-md hidden md:block cursor-pointer">
                    Detail Course
                  </button>
                </Link>
              </div>
              <hr className="dark:border-gray-700 border-gray-200 hidden md:block" />
              <div className="text-gray-500 dark:text-gray-300 mb-5 md:mb-0">
                {e.description}
              </div>
              <Link href={`/detail/course/${e.id}`}>
                <button className="button border border-gray-400 dark:border-gray-600 px-5 py-3 rounded-md block md:hidden cursor-pointer mx-auto">
                  Detail Course
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between sm:gap-0 gap-5 items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="text-sm font-medium flex items-center gap-2 dark:border-gray-600/50 border border-gray-200 bg-white dark:bg-gray-800 py-3 px-6 cursor-pointer rounded-md disabled:opacity-50"
        >
          <CircleArrowLeft /> Prev Lesson
        </button>

        <div className="text-sm font-medium dark:text-gray-400 text-gray-600">
          Page {page} of {Math.ceil(totalPage / 10) || 1}
        </div>

        <button
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, Math.ceil(totalPage / 10)))
          }
          disabled={page === Math.ceil(totalPage / 10)}
          className="text-sm font-medium flex items-center gap-2 dark:border-gray-600/50 border border-gray-200 bg-white dark:bg-gray-800 py-3 px-6 cursor-pointer rounded-md disabled:opacity-50"
        >
          Next Lesson <CircleArrowRight />
        </button>
      </div>
      {popDelete && (
        <div
          className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => setPopDelete(false)}
        >
          <div
            className="max-w-md w-full dark:bg-gray-800 bg-white border border-gray-200 dark:border-gray-600/50 z-50 px-8 py-7 flex flex-col gap-6 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 text-center">
              <div className="mx-auto p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-2">
                <Trash size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold dark:text-gray-200 text-gray-800">
                Delete Course?
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                This action cannot be undone. The course will be permanently
                deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 px-6 cursor-pointer dark:text-gray-100 text-white dark:bg-red-600 bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 transition-all duration-300 rounded-md font-semibold"
                onClick={() => {
                  handleDelete(idCourse);
                }}
              >
                Delete
              </button>
              <button
                className="flex-1 py-3 px-6 cursor-pointer border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 rounded-md font-semibold"
                onClick={() => setPopDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
