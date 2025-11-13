"use client";

import { ICourse, ICourse2, IPath } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { saveUserData } from "@/redux/userSlice";
import { formatHyphen, formatNormal, GetParamsString } from "@/utils/mainUtils";
import axios from "axios";
import { BookOpen, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PathCourse = () => {
  const title = GetParamsString();
  const dispatch = useDispatch<AppDispatch>();
  const selectedPath = useSelector(
    (state: RootState) => state.user.selectedPath
  );
  const user = useSelector((state: RootState) => state.user);
  const adminId = useSelector((state: RootState) => state.admin.id);
  const Router = useRouter();

  const [path, setPath] = useState<IPath>();
  const [course, setCourse] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse2[]>([]);
  const [notFound, setNotFound] = useState(false);

  const [addCourse, setAddCourse] = useState(false);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [load, setLoad] = useState(1);
  const [addSelects, setAddSelects] = useState<string[]>([""]);
  const [updateSelects, setUpdateSelects] = useState<string[]>([""]);
  const [deleteCourse, setDeleteCourse] = useState(false);
  const [hasDuplicateUpdate, setHasDuplicateUpdate] = useState(false);

  useEffect(() => {
    dispatch(showLoading());
    const getCourse = async () => {
      try {
        const pathId = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/title/${formatNormal(
            title
          )}`
        );

        if (!pathId.data[0].payload[0]) {
          setNotFound(true);
          Router.push("/paths");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/course/${pathId.data[0].payload[0].id}`
        );

        const objCourse = response.data[0].payload.pathCourses;
        const objPath = response.data[0].payload;

        setCourse(objCourse);
        setPath(objPath);
      } catch (error) {
        console.log(error);
        setNotFound(true);
      } finally {
        dispatch(hideLoading());
      }
    };
    getCourse();
  }, [title, dispatch, Router, notFound, load]);

  useEffect(() => {
    const getAllCourse = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course`
        );
        const all = response.data[0].payload;

        const existingCourseIds = course.map((e) => e.course.id);
        const filtered = all.filter(
          (c: ICourse2) => !existingCourseIds.includes(c.id)
        );
        setFilteredCourses(filtered);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCourse();
  }, [addCourse, course]);

  const handleSelect = async (e: number | null) => {
    dispatch(showLoading());
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/path/${user.id}`,
        { selectedPath: e },
        { withCredentials: true }
      );
      if (response.status == 200) {
        dispatch(
          showNotif({ message: "Selected Path Success", type: "success" })
        );
        const dataUser = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user.id}`
        );
        if (!dataUser)
          return dispatch(
            showNotif({ message: "User Not Found", type: "error" })
          );
        dispatch(saveUserData(dataUser.data[0].payload));
      }
    } catch (error) {
      console.log(error);
      dispatch(showNotif({ message: "Selected Path Failed", type: "error" }));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSelectChangeAdd = (index: number, value: string) => {
    const newSelects = [...addSelects];
    newSelects[index] = value;

    if (index === addSelects.length - 1 && value.trim() !== "") {
      newSelects.push("");
    }
    if (value.trim() === "") {
      newSelects.splice(index + 1);
    }
    setAddSelects(newSelects);
  };

  const handleSelectChangeUpdate = (index: number, value: string) => {
    const newSelects = [...updateSelects];
    newSelects[index] = value;
    setUpdateSelects(newSelects);
  };

  const getAvailableCourses = (currentIndex: number) => {
    const selectedIds = addSelects
      .filter((_, i) => i !== currentIndex)
      .filter((id) => id !== "")
      .map(Number);
    return filteredCourses.filter((c) => !selectedIds.includes(c.id));
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path?.id) return console.log("Path ID not found");

    if (
      addSelects.length === 0 ||
      (addSelects.length === 1 && addSelects[0] === "")
    ) {
      return false;
    }

    try {
      dispatch(showLoading());
      const lastOrderIndex =
        course.length > 0 ? course[course.length - 1].orderIndex : 0;
      const validSelects = addSelects.filter((id) => id.trim() !== "");

      const payload = validSelects.map((id, index) => ({
        pathId: path.id,
        courseId: Number(id),
        orderIndex: lastOrderIndex + index + 1,
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pathcourse`,
        payload
      );

      if (response.status === 200) {
        dispatch(showNotif({ message: "Add Course Success", type: "success" }));
        setAddCourse(false);
        const updated = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/course/${path.id}`
        );
        setAddCourse(false);
        setAddSelects([""]);
        setCourse(updated.data[0].payload.pathCourses);
      }
    } catch (error) {
      console.log(error);
      dispatch(showNotif({ message: "Add Course Failed", type: "error" }));
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (updateCourse && course.length > 0) {
      const existingIndexes = course.map((c) => String(c.orderIndex));
      setUpdateSelects(existingIndexes);
    }
  }, [updateCourse, course]);

  useEffect(() => {
    const nonEmptyUpdate = updateSelects.filter((id) => id.trim() !== "");
    const duplicateUpdate = nonEmptyUpdate.some(
      (id, i) => nonEmptyUpdate.indexOf(id) !== i
    );
    setHasDuplicateUpdate(duplicateUpdate);
  }, [updateSelects]);

  const handleUpdateCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!path?.id) return console.log("Path ID not found");

    try {
      dispatch(showLoading());

      const newOrders = updateSelects.map((v) => Number(v));
      const payload = course.map((c, index) => ({
        id: c.id,
        orderIndex: newOrders[index],
      }));

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pathcourse/update`,
        payload
      );

      if (response.status === 200) {
        dispatch(
          showNotif({ message: "Update Index Course Success", type: "success" })
        );
        setUpdateCourse(false);
        const updated = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path/course/${path.id}`
        );
        setUpdateSelects([""]);
        setCourse(updated.data[0].payload.pathCourses);
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showNotif({ message: "Update Index Course Failed", type: "error" })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDelete = async (id: number) => {
    if (!deleteCourse) return;
    dispatch(showLoading());
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pathcourse/delete/${id}`
      );
      if (response.status == 200) {
        setDeleteCourse(false);
        setLoad(load + 1);
        return dispatch(
          showNotif({ message: "Delete Path Course Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Failed To Delete Path Course", type: "error" })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  if (notFound) return null;
  return (
    <>
      <div className="py-13 xl:px-55 lg:px-40 md:px-5 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-10 mb-12">
          <div className="flex flex-col justify-between items-start space-y-8">
            <div>
              <h1 className="sm:text-3xl text-3xl font-medium text-start dark:text-gray-200">
                {path?.name}
              </h1>
            </div>
            <div className="text-left text-md font-normal max-w-lg lg:max-w-xl prose prose-gray dark:text-gray-400 -tracking-tighter">
              {path?.description}
            </div>
          </div>

          <div>
            {adminId ? null : selectedPath === path?.id ? (
              <button className="button border border-gray-400 dark:border-gray-600 px-6 py-3 rounded-md text-sm">
                Selected Path
              </button>
            ) : (
              <button
                className="button border border-gray-400 dark:border-gray-600 px-6 py-3 rounded-md text-sm cursor-pointer"
                onClick={() => handleSelect(Number(path?.id))}
              >
                Select Path
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {course?.length > 0 ? (
            course?.map((e, i) => (
              <div
                key={i}
                className={`w-full relative border py-8 px-8 flex flex-col gap-5 rounded-lg bg-white ${
                  deleteCourse
                    ? "border-red-500 dark:bg-gray-800 bg-white cursor-pointer"
                    : "dark:bg-gray-800 border-gray-200 bg-white dark:border-gray-600/50"
                }`}
                onClick={() => handleDelete(e.id)}
              >
                <div className="flex sm:items-center justify-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-7 sm:mb-3">
                    <Image
                      src={e.course.imageCourse}
                      alt={e.course.title}
                      width={400}
                      height={300}
                      className="max-w-24 max-h-24 p-2 rounded-full bg-gray-50 dark:bg-gray-700/50"
                    />
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl mx-auto sm:mx-0 dark:text-gray-200 text-gray-800 font-medium">
                        <div>{e.course.title}</div>
                      </h2>
                      <div className="text-sm dark:text-gray-400 flex gap-2 justify-center sm:justify-start">
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
                    onClick={(e) => {
                      if (deleteCourse) e.preventDefault();
                    }}
                    href={`/paths/${formatHyphen(title)}/courses/${formatHyphen(
                      e.course.title
                    )}`}
                    className="button border border-gray-400 dark:border-gray-600 px-5 py-3 rounded-md hidden md:block"
                  >
                    Open Course
                  </Link>
                </div>
                <hr className="dark:border-gray-700 border-gray-200 hidden md:block" />
                <div className="text-gray-500 dark:text-gray-300 mb-5 md:mb-0">
                  {e.course.description}
                </div>
                <div className="block md:hidden mx-auto">
                  <Link
                    href={`/paths/${formatHyphen(title)}/courses/${formatHyphen(
                      e.course.title
                    )}`}
                    className="button border border-gray-400 dark:border-gray-600 px-5 py-3 rounded-md"
                  >
                    Open Course
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                No Courses Available In This Path
              </h2>
            </div>
          )}
        </div>
        {adminId ? (
          <div className="flex gap-2 sm:gap-5 mt-10 justify-between">
            <button
              className="button border border-gray-400 dark:border-gray-600 px-6 py-3 rounded-md text-sm cursor-pointer flex-1"
              onClick={() => setAddCourse(true)}
            >
              <div className="font-medium">Add Courses</div>
            </button>
            <button
              className="button border border-gray-400 dark:border-gray-600 px-6 py-3 rounded-md text-sm cursor-pointer flex-1"
              onClick={() => setUpdateCourse(true)}
            >
              <div className="font-medium">Update Index</div>
            </button>
            <button
              className="button border border-gray-400 dark:border-gray-600 px-6 py-3 rounded-md text-sm cursor-pointer flex-1"
              onClick={() => setDeleteCourse(!deleteCourse)}
            >
              <div className="font-medium">Delete Course</div>
            </button>
          </div>
        ) : null}
      </div>

      {addCourse && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => setAddCourse(false)}
        >
          <div
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Add Course
              </h1>

              <form className="space-y-4" onSubmit={handleAddCourse}>
                {addSelects.map((value, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course {course.length + 1 + index}
                    </label>
                    <select
                      value={value}
                      onChange={(e) =>
                        handleSelectChangeAdd(index, e.target.value)
                      }
                      className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Select a course</option>
                      {getAvailableCourses(index).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    className={`bg-teal-700 hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-500 w-full text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm ${
                      addSelects.length == 1 && "cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={addSelects.length == 0}
                  >
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {updateCourse && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => {
            setUpdateCourse(false);
            setUpdateSelects([""]);
          }}
        >
          <div
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Update Index Course
              </h1>

              <form className="space-y-4" onSubmit={handleUpdateCourse}>
                {course.map((value, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course {index + 1}
                    </label>
                    <select
                      value={updateSelects[index] || ""}
                      onChange={(e) =>
                        handleSelectChangeUpdate(index, e.target.value)
                      }
                      className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    >
                      {course.map((c) => (
                        <option key={c.course.id} value={c.orderIndex}>
                          {c.course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    className={`w-full text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm ${
                      hasDuplicateUpdate
                        ? "bg-gray-400"
                        : "bg-teal-700 hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-500 cursor-pointer"
                    }`}
                    type="submit"
                    disabled={hasDuplicateUpdate}
                  >
                    {hasDuplicateUpdate
                      ? "Duplicate Course Found"
                      : "Update Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PathCourse;
