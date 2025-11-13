"use client";
import { ICourseLesson, ILessonProgress } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { formatHyphen, formatNormal } from "@/utils/mainUtils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkDown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { CircleArrowRight, GraduationCap } from "lucide-react";

export default function LessonPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);
  const Router = useRouter();
  const params = useParams();
  const hyphenLesson = params?.lessonTitle as string;
  const [isClient, setIsClient] = useState(false);
  const [notFound, setNotFound] = useState(true);
  const [lesson, setLesson] = useState<ILessonProgress>();
  const [course, setCourse] = useState<ICourseLesson>();
  const [pathTitle, setPathTitle] = useState<string>();
  const [nextLesson, setNextlesson] = useState<string>();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(showLoading());
    const getLesson = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_SERVER_URL
          }/api/lesson/title/${formatNormal(hyphenLesson)}/${userId ?? null}`
        );
        if (!response.data[0].payload) {
          Router.push("/paths");
          return dispatch(
            showNotif({ message: "Lesson Invalid", type: "error" })
          );
        }
        if (response.status == 200) {
          setNotFound(false);
          const test = await axios.get(
            `${
              process.env.NEXT_PUBLIC_SERVER_URL
            }/api/lesson/by-title/${formatNormal(hyphenLesson)}`
          );
          const course =
            test.data[0].payload[0].LessonSection.lessonCourse[0].course;
          setCourse(course);
          setPathTitle(
            test.data[0].payload[0].LessonSection.lessonCourse[0].course
              .pathCourses[0].path.name
          );
          if (test.data[0].payload[1] != null) {
            setNextlesson(test.data[0].payload[1].title);
          }
          const lessonResponse = response.data[0].payload;
          const lessonContent = lessonResponse.content;
          if (!lessonContent) {
            const contentGithub = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson/github/${lessonResponse.id}`
            );
            return setLesson(contentGithub.data[0].payload);
          }
          return setLesson(lessonResponse);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            Router.push("/paths");
            return dispatch(
              showNotif({ message: "Lesson Not Found", type: "error" })
            );
          } else {
            return dispatch(
              showNotif({ message: "Something went wrong", type: "error" })
            );
          }
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        dispatch(hideLoading());
      }
    };
    getLesson();
  }, [dispatch, hyphenLesson, Router, userId]);

  const handleCompleted = async () => {
    dispatch(showLoading());
    try {
      const data = {
        userId,
        lessonId: lesson?.id,
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/progress/completed`,
        data
      );
    } catch (error) {
      console.log(error);
      return dispatch(
        showNotif({ message: "Completed Progress Failed", type: "error" })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  if (notFound) return null;
  if (!isClient) return null;
  return (
    <>
      <div className="py-13 xl:px-75 lg:px-40 md:px-5 px-4">
        {lesson && (
          <>
            <div>
              {course ? (
                <div className="flex space-y-4 items-center flex-col justify-center xl:space-y-0 xl:space-x-4 xl:flex-row xl:justify-start mb-5">
                  <div>
                    <Image
                      src={course.imageCourse}
                      alt={course.title}
                      width={400}
                      height={300}
                      className="max-w-28 max-h-28 p-2 rounded-full bg-gray-50 dark:bg-gray-700/50"
                    />
                  </div>
                  <div className="flex flex-col xl:items-start items-center">
                    <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      {lesson.title}
                    </div>
                    <div className="min-w-full text-lg text-gray-500 dark:text-gray-400">
                      {course.title}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="flex justify-center px-4 py-10">
                <article className="lesson-content prose prose-gray prose-a:text-blue-800 prose-a:visited:text-purple-800 prose-code:bg-gray-100 prose-code:p-1 prose-code:font-normal dark:prose-a:text-blue-300 dark:prose-a:visited:text-purple-300 dark:prose-code:bg-gray-700/40 prose-code:rounded-md break-words line-numbers dark:prose-invert dark:antialiased prose-pre:rounded-xl prose-pre:bg-slate-800 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/70 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 min-w-full">
                  <ReactMarkDown>{lesson?.content}</ReactMarkDown>
                </article>
              </div>
            </div>
            <div className="border-t-1 border-gray-700">
              <div className="flex flex-col md:flex-row justify-between py-5 mt-4 gap-3 md:gap-0 md:px-0 px-8">
                {pathTitle && course ? (
                  <Link
                    href={`/paths/${formatHyphen(
                      pathTitle
                    )}/courses/${formatHyphen(course.title)}`}
                    className="button border border-gray-400 dark:border-gray-600 px-5 py-3 font-medium rounded-md"
                  >
                    <button className="flex gap-3 justify-center items-center mx-auto md:mx-0 cursor-pointer">
                      <GraduationCap /> View Course
                    </button>
                  </Link>
                ) : null}
                {userId ? (
                  lesson?.progress?.[0]?.status === "COMPLETED" ? (
                    <button className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 font-medium rounded-md flex items-center cursor-pointer justify-center w-full md:w-fit">
                      Lesson Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsCompleted(true);
                        handleCompleted();
                      }}
                      className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 font-medium rounded-md flex items-center cursor-pointer justify-center w-full md:w-fit"
                    >
                      {isCompleted ? "Lesson Complete" : "Mark Complete"}
                    </button>
                  )
                ) : (
                  <Link
                    href={"/sign_in"}
                    className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 font-medium flex items-center rounded-md cursor-pointer"
                  >
                    <button className="mx-auto md:mx-0 cursor-pointer">
                      Sign In To Track Progress
                    </button>
                  </Link>
                )}
                {nextLesson ? (
                  <Link
                    href={`/lesson/${formatHyphen(nextLesson)}`}
                    className="button border border-gray-400 dark:border-gray-600 px-5 py-3 font-medium rounded-md"
                  >
                    <button className="flex gap-3 justify-center items-center cursor-pointer mx-auto md:mx-0">
                      <CircleArrowRight /> Next Lesson
                    </button>
                  </Link>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
