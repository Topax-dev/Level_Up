"use client";

import { IDetailLeson } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactMarkDown from "react-markdown";
import { ArrowRight, BookOpen, Pen, TvMinimal, Wrench } from "lucide-react";
import Link from "next/link";

const Detaillesson = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [notFound, setNotFound] = useState(true);
  const [lesson, setLesson] = useState<IDetailLeson>();
  const [load, setLoad] = useState(0);

  useEffect(() => {
    const getDetaillesson = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson/${id}`
        );
        if (!response.data[0].payload) {
          router.push("/");
          return dispatch(
            showNotif({ message: "Id Is Invalid", type: "info" })
          );
        }
        setNotFound(false);
        setLesson(response.data[0].payload);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getDetaillesson();
  }, [dispatch, id, router, load]);

  const handleFetch = async (id : number) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson/github/${id}`)
        if(response.status === 200) {
            console.log(response)
            setLoad(load + 1)
            return dispatch(showNotif({ message : 'Fetch Success', type : 'success' }))
        } 
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.status === 404) {
          return dispatch(showNotif({ message : 'File Not Found', type: 'error' }))
        }
      }
      console.log(error);
    }
  };

  if (notFound) return null;

  return (
    <div className="min-h-screen">
      {lesson ? (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 rounded-lg border border-teal-500/20">
                  {lesson.type === "READING" ? (
                    <BookOpen
                      size={24}
                      className="text-emerald-400"
                      strokeWidth={2.5}
                    />
                  ) : lesson.type === "WATCH" ? (
                    <TvMinimal
                      size={24}
                      className="text-emerald-400"
                      strokeWidth={2.5}
                    />
                  ) : lesson.type === "PROJECT" ? (
                    <Wrench
                      size={24}
                      className="text-emerald-400"
                      strokeWidth={2.5}
                    />
                  ) : lesson.type === "QUIZ" ? (
                    <Pen
                      size={24}
                      className="text-emerald-400"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </div>
                <span className="text-sm font-medium text-slate-400">
                  {lesson.LessonSection
                    ? (
                      <Link href={`/detail/section/${lesson.LessonSection.id}`}>
                        {lesson.LessonSection.title}
                      </Link>
                    )
                    : "Sections Not Found"}
                </span>
              </div>
              {lesson.sourceUrl && (
                <div
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg transition-colors cursor-pointer"
                  onClick={() => handleFetch(lesson.id)}
                >
                  Fetch
                </div>
              )}
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              {lesson.title}
            </h1>

            {lesson.sourceUrl && (
              <span className="inline-flex items-center gap-2 text-teal-400 mt-4 hover:text-emerald-300 font-medium transition-colors group cursor-pointer">
                View Source <ArrowRight />
              </span>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-10">
            <div className="lesson-content prose prose-lg prose-invert prose-slate prose-headings:text-white prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 prose-a:visited:text-purple-400 prose-strong:text-white prose-code:text-emerald-400 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:shadow-2xl prose-li:text-slate-300 prose-li:leading-relaxed prose-blockquote:border-l-emerald-500 prose-blockquote:text-slate-400 prose-img:rounded-xl prose-img:border prose-img:border-slate-800 max-w-none">
              <ReactMarkDown>{lesson.content}</ReactMarkDown>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Detaillesson;
