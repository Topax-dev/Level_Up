"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { IPath } from "@/interface/iAll";
import { formatHyphen } from "@/utils/mainUtils";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { saveUserData } from "@/redux/userSlice";
import { startRender } from "@/redux/notRenderSlice";

const Paths = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [path, setPath] = useState<IPath[]>();
  const [pathFoundations, setPathFoundations] = useState<IPath>();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (!user.id) return;
    setIsLogin(true);
  }, [user?.id]);

  useEffect(() => {
    dispatch(startRender())
    const getFoundationsPath = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path?name=Foundations`
        );
        const obj = response.data[0].payload[0];
        setPathFoundations(obj);
      } catch (error) {
        return console.log(error);
      }
    };
    const getPaths = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/path`
        );
        const obj = response.data[0].payload;
        setPath(obj);
      } catch (error) {
        return console.log(error);
      }
    };
    getFoundationsPath();
    getPaths();
  }, [dispatch]);

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
          dispatch(
            showNotif({ message: "Selected Path Success", type: "success" })
          )
        );
        const dataUser = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user.id}`
        );
        if (!dataUser) {
          return dispatch(
            showNotif({ message: "The Fuck Who Is You", type: "error" })
          );
        }
        return dispatch(saveUserData(dataUser.data[0].payload));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        dispatch(showNotif({ message: "Selected Path Failed", type: "error" }))
      );
    } finally {
      dispatch(hideLoading());
      setMounted(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="py-15 xl:px-55 lg:px-40 md:px-5 px-4">
      <div>
        <div>
          <h2 className="text-3xl font-bold text-center dark:text-gray-200 mb-10">
            All Paths
          </h2>
        </div>
        <div className="flex flex-col gap-5 mb-10">
          {pathFoundations ? (
            <div className="w-full relative border dark:bg-gray-800 dark:border-gray-600/50 border-gray-200 py-8 px-8 flex flex-col gap-5 rounded-lg  bg-white">
              <div className="flex sm:items-center justify-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-7 sm:mb-3">
                  <div>
                    <Image
                      src={pathFoundations?.imagePath}
                      alt={pathFoundations?.name}
                      width={400}
                      height={300}
                      className="max-w-28 max-h-28 p-2 rounded-full bg-white dark:bg-gray-700/50"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-medium text-gray-800 dark:text-gray-300 ">
                      {pathFoundations?.name}
                    </h2>
                  </div>
                </div>
                <div className="hidden sm:block">
                  {isLogin ? (
                    user.selectedPath == pathFoundations?.id ? (
                      <Link
                        href={`/paths/${formatHyphen(
                          pathFoundations ? pathFoundations.name : ""
                        )}`}
                        className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                      >
                        Continue
                      </Link>
                    ) : (
                      <div className="flex gap-5">
                        <Link
                          href={`/paths/${formatHyphen(
                            pathFoundations ? pathFoundations.name : ""
                          )}`}
                          onClick={() =>
                            handleSelect(
                              pathFoundations ? pathFoundations.id : null
                            )
                          }
                          className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                        >
                          Select
                        </Link>
                        <Link
                          href={`/paths/${formatHyphen(
                            pathFoundations ? pathFoundations.name : ""
                          )}`}
                          className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                        >
                          View
                        </Link>
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/paths/${formatHyphen(
                        pathFoundations ? pathFoundations.name : ""
                      )}`}
                      className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                    >
                      Explore
                    </Link>
                  )}
                </div>
              </div>
              <hr className="dark:border-gray-700 border-gray-200 hidden sm:block" />
              <div className="text-gray-500 dark:text-gray-400 tracking-wider mb-5 md:mb-0">
                {pathFoundations?.description}
              </div>
              <div className="flex sm:hidden justify-center">
                {isLogin ? (
                  user.selectedPath == pathFoundations?.id ? (
                    <Link
                      href={`/paths/${formatHyphen(
                        pathFoundations ? pathFoundations.name : ""
                      )}`}
                      className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                    >
                      Continue
                    </Link>
                  ) : (
                    <div className="flex gap-5">
                      <Link
                        href={`/paths/${formatHyphen(
                          pathFoundations ? pathFoundations.name : ""
                        )}`}
                        onClick={() =>
                          handleSelect(
                            pathFoundations ? pathFoundations.id : null
                          )
                        }
                        className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                      >
                        Select
                      </Link>
                      <Link
                        href={`/paths/${formatHyphen(
                          pathFoundations ? pathFoundations.name : ""
                        )}`}
                        className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                      >
                        View
                      </Link>
                    </div>
                  )
                ) : (
                  <Link
                    href={`/paths/${formatHyphen(
                      pathFoundations ? pathFoundations.name : ""
                    )}`}
                    className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                  >
                    Explore
                  </Link>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            <h1 className="text-2xl font-bold text-center dark:text-gray-200">
              Then Choose a Learning Path
            </h1>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {path?.map((e) => (
              <div
                className="w-full border dark:bg-gray-800 dark:border-gray-600/50 border-gray-200 py-8 px-8 flex flex-col gap-5 relative rounded-lg bg-white"
                key={e.id}
              >
                {e.id == user.selectedPath ? (
                  <span className="absolute top-5 right-5 w-fit justify-end items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                    Selected
                  </span>
                ) : (
                  ""
                )}
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
                  {isLogin ? (
                    user.selectedPath == e.id ? (
                      <Link
                        href={`/paths/${formatHyphen(e.name)}`}
                        className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                      >
                        Continue
                      </Link>
                    ) : (
                      <div className="flex gap-5">
                        <Link
                          href={`/paths/${formatHyphen(e.name)}`}
                          onClick={() => handleSelect(e.id)}
                          className="button text-white dark:text-gray-200 bg-teal-700 px-10 py-3 lg:px-12 rounded-md"
                        >
                          Select
                        </Link>
                        <Link
                          href={`/paths/${formatHyphen(e.name)}`}
                          className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                        >
                          View
                        </Link>
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/paths/${formatHyphen(e.name)}`}
                      className="button border border-gray-400 dark:border-gray-600 px-10 py-3 lg:px-12 rounded-md"
                    >
                      Explore
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paths;
