"use client";

import { ICourseLesson, ILesson, ILessonLessonSection } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { formatHyphen, formatNormal } from "@/utils/mainUtils";
import axios from "axios";
import {
  BookOpen,
  CheckIcon,
  ClipboardPenLine,
  Pen,
  Plus,
  Trash,
  TvMinimalPlayIcon,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LessonSection = () => {
  const user = useSelector((state: RootState) => state.user);
  const admin = useSelector((state: RootState) => state.admin.id);
  const params = useParams();
  const hyphenCourse = params?.course as string;
  const courseTitle = formatNormal(hyphenCourse);
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<number | "">("");
  const [addLesson, setAddLesson] = useState(false);
  const [availableLessons, setAvailableLessons] = useState<ILesson[]>([]);
  const [currentLessonSectionId, setCurrentLessonSectionId] = useState<
    number | null
  >(null);

  const [SelectsAddLesson, setSelectsAddLesson] = useState<string[]>([""]);
  const [updateSelects, setUpdateSelects] = useState<number[]>([]);
  const [DeleteLesson, setDeleteLesson] = useState(false);

  const [formInput, setFormInput] = useState({
    titleLessonSection: "",
  });
  const [filteredLessonSection, setFilteredLessonSection] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);
  const [lesson, setLesson] = useState<ILessonLessonSection[]>([]);
  const [updateIndexSection, setUpdateIndexSection] = useState(false);
  const [course, setCourse] = useState<ICourseLesson>();
  const [load, setLoad] = useState(1);
  const [choseeSection, setChoseeSection] = useState(false);
  const [addLessonSection, setAddLessonSection] = useState(false);
  const [deleteLessonSection, setDeleteLessonSection] = useState(false);
  const [updateIndexLesson, setUpdateIndexLesson] = useState(false);
  const [selectsUpdateLessonIndex, setSelectsUpdateLessonIndex] = useState<
    number[]
  >([]);
  const [dataUpdateLessonIndex, setDataUpdateLessonIndex] = useState<
    { id: number; title: string; orderIndex: number }[]
  >([]);
  const [deleteSection, setDeleteSection] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteSection = async (idSection: number) => {
    if (!deleteSection) return;
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-course/${idSection}`
      );
      if (response.status == 200) {
        setLoad(load + 1);
        setDeleteSection(false);
        return dispatch(
          showNotif({ message: "Delete Section Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  useEffect(() => {
    dispatch(showLoading());
    const getLessonCourse = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/id-course/lesson/title/${courseTitle}`
        );

        if (!response.data[0].payload[0]) {
          setMounted(false);
          dispatch(showNotif({ message: "Title Is Not Found", type: "error" }));
          return router.push("/paths");
        }

        const courseId = response.data[0].payload[0].id;
        if (user.id) {
          const response2 = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course/all-lesson/progress/${courseId}/${user.id}`
          );
          console.log(response2);
          setLesson(response2.data[0].payload[0].LessonCourse);
          setCourse(response2.data[0].payload[0]);
          return;
        }
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course/all-lesson/${courseId}`
        );
        setCourse(response2.data[0].payload[0]);
        setLesson(response2.data[0].payload[0].LessonCourse);
      } catch (error) {
        console.log(error);
        return dispatch(showNotif({ message: "Server Error", type: "error" }));
      } finally {
        dispatch(hideLoading());
      }
    };
    getLessonCourse();
  }, [dispatch, courseTitle, router, user.id, load]);

  useEffect(() => {
    const getLessonSection = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section`
      );
      const allLesson = response.data[0].payload;
      const existingLessonSectionId = lesson.map((e) => e.LessonSection.id);
      const existingSectionIndex = lesson.map((e) => e.orderIndex);
      const filteredLesson = allLesson.filter(
        (e: ILessonLessonSection) => !existingLessonSectionId.includes(e.id)
      );
      setUpdateSelects(existingSectionIndex);
      setFilteredLessonSection(filteredLesson);
    };
    getLessonSection();
  }, [lesson]);

  const handleAddLessonSection = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (choseeSection) {
        if (!selectedSectionId) return;
        const data = {
          courseId: course?.id,
          lessonSectionId: selectedSectionId,
        };
        const response2 = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-course`,
          data
        );

        if (response2.status === 200) {
          setAddLessonSection(false);
          setFormInput((prev) => ({
            ...prev,
            titleLessonSection: "",
          }));
          setLoad(load + 1);
          return;
        }
      }
      if (formInput.titleLessonSection === "") return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section`,
        { titleLessonSection: formInput.titleLessonSection }
      );

      const lessonSectionId = response.data[0].payload.id;
      const data = {
        courseId: course?.id,
        lessonSectionId,
      };
      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-course`,
        data
      );

      if (response2.status === 200) {
        setAddLessonSection(false);
        setFormInput((prev) => ({
          ...prev,
          titleLessonSection: "",
        }));
        setLoad(load + 1);
        return;
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.status == 403) return dispatch(showNotif({ message : 'Title Section Already Exist', type : 'info' })) 
      }
      console.log(error);
    }
  };

  const handleUpdateIndexSection = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newOrders = updateSelects.map((v) => Number(v));
      const payload = lesson.map((c, index) => ({
        id: c.id,
        orderIndex: newOrders[index],
      }));
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-course`,
        payload
      );
      if (response.status == 200) {
        setLoad(load + 1);
        setUpdateIndexSection(false);
        return dispatch(
          showNotif({
            message: "Update Index Section Success",
            type: "success",
          })
        );
      }
    } catch (error) {
      dispatch(showNotif({ message: "Server Error", type: "error" }));
      console.log(error);
      return;
    }
  };

  const getAvailableLesson = async (index: number) => {
    try {
      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson`
      );
      const allLesson = response3.data[0].payload;
      const idLesson = lesson[index].LessonSection.lesson.map(
        (e: { id: number }) => e.id
      );

      const availableLesson = allLesson.filter(
        (item: { id: number }) => !idLesson.includes(item.id)
      );
      return availableLesson;
    } catch (error) {
      console.error("Error getting available lessons:", error);
      return [];
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (SelectsAddLesson.length === 1) {
      return;
    }
    try {
      const validSelects = SelectsAddLesson.filter(
        (e: string) => e.trim() !== ""
      );
      const idLesson = validSelects.map((e: string) => Number(e));

      const payload = idLesson.map((e) => ({
        id: e,
        lessonSectionId: currentLessonSectionId,
      }));
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-lesson-to-section`,
        payload
      );
      if (response.status == 200) {
        setLoad(load + 1);
        setAddLesson(false);
        return dispatch(
          showNotif({
            message: "Add Lesson To Section Success",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Failed To Add Lesson", type: "error" })
      );
    }
  };

  const handleFixDeleteLessonSection = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-course/${currentLessonSectionId}`
      );
      if (response.status == 200) {
        setLoad(load + 1);
        setDeleteLessonSection(false);
        return dispatch(
          showNotif({ message: "Delete Section Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Delete Section Failed", type: "error" })
      );
    }
  };

  const getLessonBySectionId = async (idSection: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson-section-id/${idSection}`
      );
      const orderIndexlesson = response.data[0].payload.map(
        (e: { orderIndex: number }) => Number(e.orderIndex)
      );
      setSelectsUpdateLessonIndex(orderIndexlesson);
      setDataUpdateLessonIndex(response.data[0].payload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateIndexLeson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = dataUpdateLessonIndex.map((e, i) => ({
        id: e.id,
        orderIndex: selectsUpdateLessonIndex[i],
      }));
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-lesson-index`,
        payload
      );
      if (response.status == 200) {
        setLoad(load + 1);
        setUpdateIndexLesson(false);
        dispatch(
          showNotif({ message: "Update Index Lesson Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Update Index Lesson Failed", type: "error" })
      );
    }
  };

  const handleDeletelesson = async (idLesson: number) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/delete-lesson-section/${idLesson}`
      );
      if (response.status == 200) {
        setLoad(load + 1);
        return dispatch(
          showNotif({ message: "Delete Lesson Success", type: "success" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Delete Lesson Failed", type: "error" })
      );
    }
  };

  if (!mounted) return null;
  return (
    <div className="py-13 xl:px-75 lg:px-40 md:px-5 px-4">
      {course ? (
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="z-20 opacity-100 dark:bg-gray-900 bg-gray-50 cursor-pointer">
            <Image
              src={course.imageCourse}
              width={500}
              height={500}
              alt="Foto Course"
              className="max-w-24 object-cover curser-pointer"
            />
          </div>
          <div className="mb-8">
            <div className="text-4xl dark:text-gray-200 text-gray-800 font-normal">
              {course.title}
            </div>
          </div>
          <div className="w-full">
            <div className="text-xl font-medium mb-1">Overview</div>
            <div className="font-medium text-base dark:text-gray-400 text-gray-600">
              {course.description}
            </div>
          </div>
        </div>
      ) : null}
      {lesson?.length != 0 && lesson ? (
        <div>
          <div className="flex flex-col gap-8">
            {lesson.map((e, i) => (
              <div
                key={e.LessonSection.id}
                className={`min-h-20 w-full rounded-lg border border-gray-200 relative ${
                  deleteSection
                    ? "border-red-500 dark:bg-gray-800 bg-white cursor-pointer"
                    : "dark:bg-gray-800 border-gray-200 bg-white dark:border-gray-600"
                }`}
                onClick={() => handleDeleteSection(e.id)}
              >
                {admin ? (
                  <div className="absolute -top-4 right-4 flex gap-2">
                    <button
                      className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md"
                      onClick={async () => {
                        const result = await getAvailableLesson(i);
                        setAvailableLessons(result);
                        setSelectsAddLesson([""]);
                        setCurrentLessonSectionId(e.LessonSection.id);
                        setAddLesson(true);
                      }}
                    >
                      <Plus size={18} className="dark:text-white text-black" />
                    </button>

                    <button
                      className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md"
                      onClick={async () => {
                        await getLessonBySectionId(e.LessonSection.id);
                        setUpdateIndexLesson(true);
                      }}
                    >
                      <ClipboardPenLine
                        size={18}
                        className="dark:text-white text-black"
                      />
                    </button>
                    <button
                      className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md"
                      onClick={() => {
                        setCurrentLessonSectionId(e.id);
                        setDeleteLesson(!DeleteLesson);
                      }}
                    >
                      <Trash size={18} className="dark:text-white text-black" />
                    </button>
                  </div>
                ) : null}
                <div className="py-3 px-6">
                  <h1 className="text-lg font-medium dark:text-gray-100 text-gray-700">
                    {e.LessonSection.title}
                  </h1>
                </div>
                <hr className="dark:border-gray-600 border-gray-200" />
                <div className="py-3 px-3 flex flex-col w-full gap-2">
                  {e.LessonSection.lesson?.length === 0 ? (
                    <div className="flex justify-center py-5">
                      <h1 className="text-xl font-medium text-gray-400">
                        There are no Lessons Yet
                      </h1>
                    </div>
                  ) : (
                    e.LessonSection.lesson.map((e, i) => (
                      <Link
                        href={`/lesson/${formatHyphen(e.title)}`}
                        aria-disabled={false}
                        onClick={(e) => {
                          if (DeleteLesson) e.preventDefault();
                        }}
                        key={i}
                        className={`flex justify-between py-3 px-2 dark:hover:bg-gray-400/10 hover:bg-gray-600/10 cursor-pointer rounded-sm`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-gray-500">
                            {e.type === "READING" ? (
                              <BookOpen />
                            ) : e.type === "WATCH" ? (
                              <TvMinimalPlayIcon />
                            ) : e.type === "PROJECT" ? (
                              <Wrench />
                            ) : e.type === "QUIZ" ? (
                              <Pen />
                            ) : null}
                          </div>
                          <div className="font-medium">{e.title}</div>
                        </div>
                        {DeleteLesson ? (
                          <button
                            className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1 cursor-pointer shadow-m"
                            onClick={() => handleDeletelesson(e.id)}
                          >
                            <Trash
                              className="text-gray-800 dark:text-white z-50"
                              size={14}
                            />
                          </button>
                        ) : null}
                        {user.id ? (
                          e.progress && e.progress.length > 0 ? (
                            e.progress.map((p, i) => (
                              <div
                                key={i}
                                className={`p-1 rounded-full h-fit ${
                                  p.status === "COMPLETED"
                                    ? "bg-green-500/50"
                                    : "bg-gray-600/50"
                                }`}
                              >
                                <CheckIcon
                                  size={15}
                                  strokeWidth={5}
                                  className="dark:text-gray-800 text-white"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="p-1 rounded-full h-fit bg-gray-300/50 dark:bg-gray-600/50">
                              <CheckIcon
                                size={15}
                                strokeWidth={5}
                                className="dark:text-gray-800 text-white"
                              />
                            </div>
                          )
                        ) : null}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-h-28 flex justify-center items-center">
          <div className="font-xl">No Lesson Yet</div>
        </div>
      )}
      {admin ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center mt-10 gap-3 sm:gap-5">
            <button
              className="button border border-gray-400 dark:border-gray-600 px-5 py-3 lg:px-5 text-sm sm:text-sm rounded-md cursor-pointer flex-1"
              onClick={() => setAddLessonSection(true)}
            >
              New Section
            </button>
            <button
              className={`button border border-gray-400 dark:border-gray-600 px-5 py-3 lg:px-5 text-sm sm:text-sm rounded-md cursor-pointer flex-1 hidden sm:block`}
              onClick={() => setUpdateIndexSection(true)}
            >
              Update Index Section
            </button>
            <button
              className={`button border border-gray-400 dark:border-gray-600 px-5 py-3 lg:px-5 text-sm sm:text-sm rounded-md cursor-pointer flex-1`}
              onClick={() => setDeleteSection(!deleteSection)}
            >
              Delete Section
            </button>
          </div>
          <div className="block sm:hidden w-full">
            <button
              className={`button border border-gray-400 dark:border-gray-600 px-5 py-3 lg:px-5 text-sm sm:text-sm rounded-md cursor-pointer w-full`}
              onClick={() => setUpdateIndexSection(true)}
            >
              Update Index Section
            </button>
          </div>
        </div>
      ) : null}
      {addLessonSection && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => {
            setAddLessonSection(false);
            setFormInput((prev) => ({
              ...prev,
              titleLessonSection: "",
            }));
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative"
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex justify-between items-center">
                <div>
                  {choseeSection ? (
                    <div>Chosee Section</div>
                  ) : (
                    <div>Add Section</div>
                  )}
                </div>
                <button
                  className="top-5 right-5 button text-white dark:text-gray-200 bg-teal-700 px-2 py-1 text-sm rounded-sm cursor-pointer"
                  onClick={() => {
                    setFormInput((prev) => ({
                      ...prev,
                      titleLessonSection: "",
                    }));
                    setChoseeSection(!choseeSection);
                  }}
                >
                  {choseeSection ? <div>Or Add</div> : <div>Or Chosee</div>}
                </button>
              </h1>

              <form action="" onSubmit={handleAddLessonSection}>
                <div className="mb-3">
                  {choseeSection ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title Section
                      </label>
                      <select
                        name=""
                        id=""
                        value={selectedSectionId}
                        onChange={(e) =>
                          setSelectedSectionId(Number(e.target.value))
                        }
                        className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">Chosee Section</option>
                        {filteredLessonSection.length !== 0
                          ? filteredLessonSection.map((e, i) => (
                              <option value={e.id} key={i}>
                                {e.title}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title Section
                      </label>

                      <input
                        type="text"
                        value={formInput.titleLessonSection}
                        onChange={handleChange}
                        name="titleLessonSection"
                        className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                        placeholder="Title"
                      />
                    </div>
                  )}
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
      {updateIndexSection && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => setUpdateIndexSection(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative"
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Update Index Section
              </h1>

              <form onSubmit={handleUpdateIndexSection}>
                <div className="flex flex-col gap-4">
                  {lesson.map((item, i) => (
                    <div
                      key={item.LessonSection.id}
                      className="flex flex-col gap-2"
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.LessonSection.title}
                      </label>

                      <select
                        value={updateSelects[i] ?? ""}
                        onChange={(e) => {
                          const newSelects = [...updateSelects];
                          newSelects[i] = Number(e.target.value);
                          setUpdateSelects(newSelects);
                        }}
                        className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      >
                        {lesson.map((e, idx) => (
                          <option key={idx} value={e.orderIndex}>
                            {e.LessonSection.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {(() => {
                  const duplicates = updateSelects.filter(
                    (v, i, arr) => arr.indexOf(v) !== i
                  );
                  const hasDuplicate = duplicates.length > 0;

                  return (
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={hasDuplicate}
                        className={`w-full font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-all ${
                          hasDuplicate
                            ? "bg-red-600/80 text-white cursor-not-allowed"
                            : "bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white"
                        }`}
                      >
                        {hasDuplicate ? "Duplicate index" : "Update Index"}
                      </button>
                    </div>
                  );
                })()}
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Add Lesson */}
      {addLesson && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => {
            setAddLesson(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative"
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Add Lesson
              </h1>

              <form onSubmit={handleAddLesson}>
                <div className="flex flex-col gap-4">
                  {SelectsAddLesson.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lesson Title
                      </label>
                      <select
                        value={SelectsAddLesson[i] ?? ""}
                        onChange={(e) => {
                          const newSelects = [...SelectsAddLesson];
                          newSelects[i] = e.target.value;

                          if (
                            i === SelectsAddLesson.length - 1 &&
                            e.target.value.trim() !== ""
                          ) {
                            newSelects.push("");
                          }

                          if (
                            e.target.value.trim() === "" &&
                            newSelects.length > 1 &&
                            i === newSelects.length - 2
                          ) {
                            newSelects.splice(i, 1);
                          }

                          setSelectsAddLesson(newSelects);
                        }}
                        className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      >
                        <option value="">Select Lesson</option>
                        {availableLessons
                          .filter((lesson) => {
                            const isSelectedInAnySelect = SelectsAddLesson.some(
                              (selected) => selected === lesson.id.toString()
                            );

                            const isCurrentlySelected =
                              SelectsAddLesson[i] === lesson.id.toString();

                            return (
                              !isSelectedInAnySelect || isCurrentlySelected
                            );
                          })
                          .map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button className="w-full text-white font-medium px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-500 cursor-pointer">
                    Add Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {deleteLessonSection && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center"
          onClick={() => setDeleteLessonSection(false)}
        >
          <div
            className="max-w-96 max-h-44 dark:bg-gray-900 bg-gray-200 z-20 px-7 py-5 flex flex-col gap-7 rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium text-center">
                Are You Sure?
              </div>
            </div>

            <div className="flex gap-4 justify-between items-center">
              <button
                className="py-2 px-10 cursor-pointer dark:text-gray-500 text-gray-100 dark:bg-red-500 bg-red-700 duration-500 rounded-md"
                onClick={handleFixDeleteLessonSection}
              >
                Yes
              </button>
              <button
                className="py-2 px-10 cursor-pointer border border-gray-700 duration-500 rounded-md"
                onClick={() => setDeleteLessonSection(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {updateIndexLesson && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => setUpdateIndexLesson(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark:bg-gray-900 bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative"
          >
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Update Index Section
              </h1>

              <form onSubmit={handleUpdateIndexLeson}>
                <div className="flex flex-col gap-4">
                  {dataUpdateLessonIndex.map((item, i) => (
                    <div key={item.id} className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.title}
                      </label>

                      <select
                        value={selectsUpdateLessonIndex[i] ?? ""}
                        onChange={(e) => {
                          const newSelects = [...selectsUpdateLessonIndex];
                          newSelects[i] = Number(e.target.value);
                          setSelectsUpdateLessonIndex(newSelects);
                        }}
                        className="block w-full border rounded-lg py-2.5 px-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      >
                        {dataUpdateLessonIndex.map((e, idx) => (
                          <option key={idx} value={e.orderIndex}>
                            {e.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {(() => {
                  const duplicates = selectsUpdateLessonIndex.filter(
                    (v, i, arr) => arr.indexOf(v) !== i
                  );
                  const hasDuplicate = duplicates.length > 0;

                  return (
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={hasDuplicate}
                        className={`w-full font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-all ${
                          hasDuplicate
                            ? "bg-red-600/80 text-white cursor-not-allowed"
                            : "bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white"
                        }`}
                      >
                        {hasDuplicate ? "Duplicate index" : "Update Index"}
                      </button>
                    </div>
                  );
                })()}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonSection;
