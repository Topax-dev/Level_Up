"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { IPath } from "@/interface/iAll";
import { ClipboardPenLine, Plus, Route, Trash } from "lucide-react";
import { showNotif } from "@/redux/notifSlice";
import { hideLoading, showLoading } from "@/redux/loadingSlice";

const Paths = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [path, setPath] = useState<IPath[]>([]);
  const [mounted, setMounted] = useState(false);
  const [load, setLoad] = useState(1);
  const [search, setSearch] = useState("");
  const [idPath, setIdPath] = useState(0);
  const [filteredPath, setFilteredPath] = useState<IPath[]>([]);
  const [popDelete, setPopDelete] = useState(false);
  const idAdmin = useSelector((state: RootState) => state.admin.id);

  useEffect(() => {
    dispatch(showLoading());
    setMounted(true);
    const getPaths = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all/path`
        );
        const obj = response.data[0].payload;
        setPath(obj);
      } catch (error) {
        return console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getPaths();
  }, [dispatch, load]);

  const handlePublish = async (id: number) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/published/${id}`
      );
      if (response.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Publish",
            explanation: `Publish path with title path ${response.data[0].payload.name}`,
          }
        );
        setLoad(load + 1);
        return dispatch(
          showNotif({ message: "Published Path Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  const handleUnPublish = async (id: number) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/un-published/${id}`
      );
      if (response.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Un Publish",
            explanation: `Un Publish path with title path ${response.data[0].payload.name}`,
          }
        );
        setLoad(load + 1);
        return dispatch(
          showNotif({ message: "UnPublised Path Succes", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/${id}`
      );
      if (response.status === 200) {
         await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Delete",
            explanation: `Delete path with title path ${response.data[0].payload.name}`,
          }
        );
        setLoad(load + 1);
        setPopDelete(false);
        return dispatch(
          showNotif({ message: "Delete Path Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredPath(path);
      return;
    }
    const filteredPath = path
      ? path.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      : [];
    setFilteredPath(filteredPath);
  }, [search, path]);

  if (!mounted) return null;

  return (
    <div className="py-10 xl:px-55 lg:px-40 md:px-5 px-4">
      <div>
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-center dark:text-gray-200 mb-3">
            All Paths
          </h2>
          <p className="text-center dark:text-gray-400 text-gray-600">
            Manage and organize your learning materials
          </p>
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Link href={"/add/paths"} className="md:w-auto w-full">
            <button className="flex itmes-center border justify-center gap-2 bg-white w-full dark:border-gray-600/50 border-gray-200 dark:bg-gray-800 py-3 px-5 cursor-pointer rounded-md">
              <Plus /> <div className="font-medium">Add New Path</div>
            </button>
          </Link>
          <div className="flex-4">
            <input
              type="text"
              name="search"
              placeholder="Search Path by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border w-full rounded-md py-3 px-4 outline-none border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600/50 dark:text-gray-300 transition-all duration-200"
            />
          </div>
        </div>
        <div>
          <div
            className={`grid gap-10 ${
              filteredPath.length === 0
                ? "grid-cols-1 place-items-center"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {filteredPath.length === 0 ? (
              <div className="grid grid-cols-1 place-items-center py-16 px-4">
                <div className="text-gray-400 mb-4">
                  <Route size={64} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                  No Path Found
                </h2>
              </div>
            ) : (
              filteredPath.map((e) => (
                <div
                  className="w-full border dark:bg-gray-800 dark:border-gray-600/50 border-gray-200 py-8 px-8 flex flex-col gap-5 relative rounded-lg bg-white"
                  key={e.id}
                >
                  <div className="absolute -top-4 right-4 flex gap-2">
                    <Link href={`/update/paths/${e.id}`}>
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
                        setIdPath(e.id);
                        setPopDelete(true);
                      }}
                    >
                      <Trash size={18} className="dark:text-white text-black" />
                    </button>
                  </div>
                  <div className="absolute top-5 cursor-pointer">
                    <div>
                      {e.isPublished ? (
                        <div
                          className="group bg-green-400/50 hover:bg-gray-400/50 p-1 px-2 rounded-md text-sm font-medium dark:text-gray-100 text-gray-900 relative cursor-pointer"
                          onClick={() => handleUnPublish(e.id)}
                        >
                          <span className="block transition-opacity duration-200 opacity-100 group-hover:opacity-0">
                            Published
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Unpublish
                          </span>
                        </div>
                      ) : (
                        <div
                          className="group bg-gray-400/50 hover:bg-green-400/50 duration-200 p-1 px-2 rounded-md text-sm font-medium dark:text-gray-100 text-gray-900 relative cursor-pointer"
                          onClick={() => handlePublish(e.id)}
                        >
                          <span className="block transition-opacity duration-200 opacity-100 group-hover:opacity-0">
                            Unpublish
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Publish
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <div>
                      <Image
                        src={e.imagePath}
                        alt="foto"
                        width={500}
                        height={500}
                        className="max-w-28 p-2 max-h-28 rounded-full bg-white dark:bg-gray-700/50"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="flex justify-between">
                      <h1 className="text-lg text-gray-400 dark:text-gray-500 font-medium">
                        PATH
                      </h1>
                      <h1 className="text-lg text-gray-400 dark:text-gray-500 font-medium">
                        {e._count.pathCourses} Course
                      </h1>
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-300">
                      {e.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 tracking-wider">
                      {e.description}
                    </p>
                  </div>

                  <div className="mt-auto mx-auto md:mx-0 flex gap-5">
                    <Link
                      href={`/detail/path/${e.id}`}
                      className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                    >
                      Detail Path
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
                Delete Path?
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                This action cannot be undone. The Path will be permanently
                deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 px-6 cursor-pointer dark:text-gray-100 text-white dark:bg-red-600 bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 transition-all duration-300 rounded-md font-semibold"
                onClick={() => {
                  handleDelete(idPath);
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

export default Paths;
