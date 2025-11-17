"use client";

import { ISection } from "@/interface/iAll";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { BookOpen, ClipboardPen, Trash, ZoomIn, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AllActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const idAdmin = useSelector((state: RootState) => state.admin.id);
  const [sections, setSections] = useState<ISection[]>([]);
  const [search, setSearch] = useState("");
  const [idSections, setIdSections] = useState(0);
  const [popDelete, setPopDelete] = useState(false);
  const [load, setLoad] = useState(0);
  const [titleSection, setTitleSection] = useState("");
  const [updateSection, setUpdateSection] = useState(false);

  useEffect(() => {
    const getAllSection = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section`
      );
      setSections(response.data[0].payload);
    };
    getAllSection();
  }, [load]);

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section/${id}`
      );
      if (response.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Delete",
            explanation: `Delete section with title section ${titleSection}`,
          }
        );
        dispatch(
          showNotif({ message: "Delete Section Success", type: "success" })
        );

        setLoad(load + 1);
        return setPopDelete(false);
      }
    } catch (error) {
      console.log(error);
      dispatch(showNotif({ message: "Delete Section Failed", type: "error" }));
    }
  };

  const handleUpdateSection = async (id: number) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section/${id}`,
        { title: titleSection }
      );
      if (response.status === 200) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`,
          {
            idAdmin,
            action: "Update",
            explanation: `Update section with title section ${titleSection}`,
          }
        );
        setLoad(load + 1);
        setUpdateSection(false);
        return dispatch(
          showNotif({ message: "Update Sections Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8 xl:px-32 lg:px-24 md:px-8 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                All Sections
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your learning sections
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search sections by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 outline-none"
            />
          </div>
        </div>

        <div
          className={`grid gap-5 ${
            filteredSections.length === 0
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filteredSections.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                <BookOpen
                  size={64}
                  strokeWidth={1.5}
                  className="text-gray-400"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Sections Found
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-center mb-6">
                {search
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first section"}
              </p>
              {!search && (
                <button className="flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium">
                  <Plus size={20} />
                  Create Section
                </button>
              )}
            </div>
          ) : (
            filteredSections.map((e, i) => (
              <div
                key={e.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <BookOpen
                          size={18}
                          className="text-gray-600 dark:text-gray-400"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        Section {i + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl dark:text-gray-200 text-gray-800 mb-2 line-clamp-2">
                      {e.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: Today
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href={`/detail/section/${e.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg p-3 font-medium"
                    title="View Details"
                  >
                    <ZoomIn size={18} strokeWidth={2} />
                    View
                  </Link>
                  <button
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 cursor-pointer"
                    title="Edit Lesson"
                    onClick={() => {
                      setIdSections(e.id);
                      setTitleSection(e.title);
                      setUpdateSection(true);
                    }}
                  >
                    <ClipboardPen
                      size={18}
                      strokeWidth={2}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setIdSections(e.id);
                      setPopDelete(true);
                    }}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 cursor-pointer"
                    title="Delete Lesson"
                  >
                    <Trash
                      size={18}
                      strokeWidth={2}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
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
                  handleDelete(idSections);
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

      {updateSection && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={() => setUpdateSection(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative"
          >
            <div className="p-6">
              <form
                action=""
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateSection(idSections);
                }}
              >
                <div className="mb-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title Section
                    </label>

                    <input
                      type="text"
                      value={titleSection}
                      onChange={(e) => setTitleSection(e.target.value)}
                      name="title"
                      className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      placeholder="Title"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    className={`w-full text-white font-medium px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-500 cursor-pointer`}
                  >
                    Add Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllActions;
