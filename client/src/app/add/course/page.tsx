"use client";
import { IFormCourse } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import Image from "next/image";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Addcourse = () => {
  const idAdmin = useSelector((state : RootState) => state.admin.id)
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<IFormCourse>({
    title: "",
    description: "",
    asset: null,
    preview: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState({
    asset: "",
    title: "",
    description: "",
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB!");
      return;
    }

    if (formData.preview) {
      URL.revokeObjectURL(formData.preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      asset: file,
      preview: previewUrl,
    }));

    setError((prev) => ({
      ...prev,
      asset: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    dispatch(showLoading());
    e.preventDefault();
    try {
      if (
        !formData.asset ||
        formData.asset == null ||
        formData.asset == undefined
      ) {
        setError((prev) => ({
          ...prev,
          asset: "Input Image Is Required",
        }));
        return;
      }
      if (formData.title.length < 8) {
        setError((prev) => ({
          ...prev,
          title: "Input Name Must Be Less Than 8 Words",
        }));
        return;
      }
      if (formData.description.length < 20) {
        setError((prev) => ({
          ...prev,
          description: "Input Description Must Be Less Than 20 Words",
        }));
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("asset", formData.asset);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`, {
          idAdmin,
          action : 'Add',
          explanation : `Add course with title course ${response.data[0].payload.title}`
        })
        setFormData((prev) => ({
          ...prev,
          title: "",
          asset: null,
          preview: "",
          description: "",
        }));
        return dispatch(
          showNotif({ message: "Add New course Success", type: "success" })
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 403)
          return dispatch(
            showNotif({ message: "Title Course Already Exist", type: "info" })
          );
      }
      console.log(error);
      return dispatch(
        showNotif({ message: "Add New course Failed", type: "error" })
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">
            Add New Course
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter course title"
                    onChange={handleChange}
                    value={formData.title}
                    className="block w-full border rounded-lg py-2.5 px-4 focus:outline-none dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all"
                  />
                  {error.title && (
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {error.title}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Course Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your course in detail"
                    onChange={handleChange}
                    value={formData.description}
                    className="block w-full border rounded-lg py-2.5 px-4 focus:outline-none dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 transition-all resize-none"
                    rows={10}
                  ></textarea>
                  {error.description && (
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {error.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Course Image
                </label>
                <div className="flex-1 flex flex-col">
                  {isClient && formData.preview ? (
                    <div
                      className="relative rounded-lg border-2 border-dashed border-blue-600 dark:border-blue-500 overflow-hidden cursor-pointer hover:border-blue-700 dark:hover:border-blue-400 transition-colors h-full min-h-[280px] lg:min-h-[362px] group"
                      onClick={handleDivClick}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="asset"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Image
                        src={formData.preview}
                        alt="Preview"
                        width={500}
                        height={500}
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-lg transition-opacity">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 cursor-pointer transition-colors h-full min-h-[280px] lg:min-h-[362px] flex items-center justify-center"
                      onClick={handleDivClick}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="asset"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="text-center p-6">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                          Click to upload image
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                  {error.asset && (
                    <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                      {error.asset}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="w-full cursor-pointer sm:w-auto px-8 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addcourse;
