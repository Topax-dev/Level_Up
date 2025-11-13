"use client";

import { ILesson } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import {
  BookOpen,
  CircleArrowLeft,
  CircleArrowRight,
  ClipboardPenLine,
  Pen,
  Plus,
  Trash,
  TvMinimal,
  Wrench,
  ZoomIn,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Lessons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const idAdmin = useSelector((state: RootState) => state.admin.id);
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [lesson, setLesson] = useState<ILesson[]>([]);
  const [popDelete, setPopDelete] = useState(false);
  const [idLesson, setIdLesson] = useState(0);

  useEffect(() => {
    const getLesson = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all/lesson`
        );
        const allLesson = response.data[0].payload;
        setLesson(allLesson);
        if (allLesson.length === 0) return;
        const responseTotalLesson = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/total/lesson`
        );
        const totalLesson = responseTotalLesson.data[0].payload;
        const page = Math.ceil(totalLesson / 10);
        setTotalPage(page);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getLesson();
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all/lesson?page=${page}&search=${search}`
      );
      setLesson(response.data[0].payload);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, page, load]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson/${id}`
      );
      if (response.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Delete",
            explanation: `Delete lesson with title lesson ${response.data[0].payload.title}`,
          }
        );
        setLoad(load + 1);
        setPopDelete(false);
        return dispatch(
          showNotif({ message: "Delete Lesson Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  return (
    <div className="py-10 xl:px-55 lg:px-40 md:px-5 px-4">
      <div className="mb-5">
        <h1 className="text-4xl font-bold text-center dark:text-gray-200 mb-3">
          All Lessons
        </h1>
        <p className="text-center dark:text-gray-400 text-gray-600 mb-8">
          Manage and organize learning materials
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href={"/add/lesson"} className="md:w-auto w-full">
            <button className="flex items-center justify-center gap-2 bg-white w-full dark:border-gray-600/50 border border-gray-200 dark:bg-gray-800 py-3.5 px-6 cursor-pointer rounded-md hover:shadow-lg transition-all duration-300 font-semibold">
              <Plus size={20} strokeWidth={2.5} />
              <span>Add New Lesson</span>
            </button>
          </Link>
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search lessons by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border w-full rounded-md py-3.5 px-5 outline-none border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600/50 dark:text-gray-300 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {lesson.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-gray-400 mb-4">
              <BookOpen size={64} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Lessons Found
            </h2>
          </div>
        ) : (
          lesson.map((e) => (
            <div
              key={e.id}
              className="border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-800 rounded-md p-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
                    {e.type === "READING" ? (
                      <BookOpen size={24} strokeWidth={2} />
                    ) : e.type === "WATCH" ? (
                      <TvMinimal size={24} strokeWidth={2} />
                    ) : e.type === "PROJECT" ? (
                      <Wrench size={24} strokeWidth={2} />
                    ) : e.type === "QUIZ" ? (
                      <Pen size={24} strokeWidth={2} />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg dark:text-gray-200 text-gray-800 truncate">
                      {e.title}
                    </h3>
                    <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {e.type}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/detail/lesson/${e.id}`}
                    className="dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border transition-all duration-200 rounded-md p-2.5 cursor-pointer border-gray-600/50"
                    title="View Details"
                  >
                    <ZoomIn size={20} strokeWidth={2} />
                  </Link>
                  <Link
                    href={`/update/lesson/${e.id}`}
                    className="dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-600/50 border transition-all duration-200 rounded-md p-2.5 cursor-pointer"
                    title="Edit Lesson"
                  >
                    <ClipboardPenLine size={20} strokeWidth={2} />
                  </Link>
                  <button
                    onClick={() => {
                      setIdLesson(e.id);
                      setPopDelete(true);
                    }}
                    className="dark:bg-gray-800 bg-gray-100 border transition-all hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-600/50 duration-200 rounded-md p-2.5 cursor-pointer"
                    title="Delete Lesson"
                  >
                    <Trash size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="text-sm font-semibold flex items-center gap-2 dark:border-gray-600/50 border border-gray-200 bg-white dark:bg-gray-800 py-3 px-7 cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center"
        >
          <CircleArrowLeft size={20} strokeWidth={2.5} /> Previous Page
        </button>

        <div className="text-sm font-medium dark:text-gray-400 text-gray-600">
          Page {page} of {totalPage || 1}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
          disabled={page === totalPage}
          className="text-sm font-semibold flex items-center gap-2 dark:border-gray-600/50 border border-gray-200 bg-white dark:bg-gray-800 py-3 px-7 cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center"
        >
          Next Page <CircleArrowRight size={20} strokeWidth={2.5} />
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
                Delete Lesson?
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                This action cannot be undone. The lesson will be permanently
                deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 px-6 cursor-pointer dark:text-gray-100 text-white dark:bg-red-600 bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 transition-all duration-300 rounded-md font-semibold"
                onClick={() => {
                  handleDelete(idLesson);
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

export default Lessons;
