"use client";
import { ILesson } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddLesson = () => {
  const idAdmin = useSelector((state : RootState) => state.admin.id)
  const dispatch = useDispatch<AppDispatch>();
  const [isContent, setIsContent] = useState(false);
  const [formData, setFormData] = useState<ILesson>({
    id: 0,
    title: "",
    content: "",
    sourceUrl: "",
    type: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState({
    sourceUrl: "",
    title: "",
    content: "",
    type: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title === "") {
      return setError((prev) => ({
        ...prev,
        title: "Title Is Required",
      }));
    }

    if (formData.type === "") {
      return setError((prev) => ({
        ...prev,
        type: "Type Is Required",
      }));
    }

    if (formData.content == "" && formData.sourceUrl == "") {
      return setError((prev) => ({
        ...prev,
        content: "This Field Is required",
        sourceUrl: "This Field Is required",
      }));
    }
    dispatch(showLoading());
    try {
      const data = {
        title: formData.title,
        type: formData.type,
        sourceUrl: formData.sourceUrl,
        content: formData.content,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lesson`,
        data
      );
      if (response.status == 200) {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`, {
          idAdmin,
          action : 'Add',
          explanation : `Add lesson with title lesson ${response.data[0].payload.title}`
        })
        setFormData((prev) => ({
          ...prev,
          sourceUrl: "",
          title: "",
          type: "",
          content: "",
        }));
        return dispatch(
          showNotif({ message: "Add Lesson Success", type: "success" })
        );
      } 
    } catch (error : unknown) {
      console.log(error);
      if(axios.isAxiosError(error)) {
        if(error.status === 403) return dispatch(showNotif({ message : 'Title Already Exist', type : 'info' }))
      }
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    } finally {
      dispatch(hideLoading());
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4"></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Add New Lesson
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Create engaging learning content for your students
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 border-gray-200 overflow-hidden backdrop-blur-sm">
          <form className="p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Lesson Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    placeholder="Lesson title"
                    onChange={handleChange}
                    value={formData.title}
                    className="block w-full border rounded-xl py-3 px-4 focus:outline-none dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>
                {error.title && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-2 flex items-center gap-1">
                    {error.title}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Lesson Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    onChange={handleChange}
                    value={formData.type}
                    className="block w-full border rounded-xl py-3 px-4 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all duration-200 outline-none appearance-none hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
                  >
                    <option value="">Select lesson type</option>
                    <option value="READING">📖 Reading</option>
                    <option value="PROJECT">🛠️ Project</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></div>
                </div>
                {error.type && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-2 flex items-center gap-1">
                    {error.type}
                  </p>
                )}
              </div>

              {isContent ? (
                <div>
                  <label
                    htmlFor=""
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Lesson Content
                  </label>
                  <div className="border dark:border-gray-700 border-gray-200 w-fit flex gap-2 cursor-pointer rounded-md mb-2">
                    <div
                      className={`text-sm font-medium pt-1.5 pb-1.5 pl-1.5 ${
                        isContent ? "" : "dark:bg-gray-600 rounded-md bg-gray-200"
                      }`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          content: "",
                        }));
                        setIsContent(false);
                      }}
                    >
                      Source Url
                    </div>
                    <div
                      className={`text-sm font-medium pt-1.5 pb-1.5 pr-1.5 pl-1.5 ${
                        isContent ? "dark:bg-gray-600 rounded-md bg-gray-200" : ""
                      }`}
                      onClick={() => setIsContent(true)}
                    >
                      Content
                    </div>
                  </div>
                  <textarea
                    name="content"
                    placeholder="Lesson Content"
                    onChange={handleChange}
                    value={formData.content}
                    className="block w-full border rounded-lg py-2.5 px-4 focus:outline-none dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all resize-none"
                    rows={20}
                  ></textarea>
                  {error.content && (
                    <p className="text-sm text-red-600 dark:text-red-500 mt-2 flex items-center gap-1">
                      {error.content}
                    </p>
                  )}
                </div>
              ) : (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Lesson Source URL
                  </label>
                  <div className="border border-gray-200 dark:border-gray-700 w-fit flex gap-2 cursor-pointer rounded-md mb-2">
                    <div
                      className={`text-sm font-medium pt-1.5 pb-1.5 pl-1.5 pr-1.5 ${
                        isContent ? "" : "dark:bg-gray-600 rounded-md bg-gray-200"
                      }`}
                      onClick={() => setIsContent(false)}
                    >
                      Source Url
                    </div>
                    <div
                      className={`text-sm font-medium pt-1.5 pb-1.5 pr-1.5 ${
                        isContent ? "dark:bg-gray-600 rounded-md bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          sourceUrl : ''
                        }))
                        setIsContent(true);
                      }}
                    >
                      Content
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                      <span className="text-gray-500 dark:text-gray-500">
                        Base URL:
                      </span>
                      <br />
                      https://raw.githubusercontent.com/Topax-dev/Lesson_levelUp/refs/heads/main/
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {formData.sourceUrl || "[your-file-name]"}
                      </span>
                      .md
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="sourceUrl"
                      placeholder="Source Url"
                      onChange={handleChange}
                      value={formData.sourceUrl}
                      className="block w-full border rounded-xl py-3 px-4 focus:outline-none dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  </div>
                  {error.sourceUrl && (
                    <p className="text-sm text-red-600 dark:text-red-500 mt-2 flex items-center gap-1">
                      {error.sourceUrl}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="w-full cursor-pointer sm:w-auto px-8 py-3.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                Create Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
