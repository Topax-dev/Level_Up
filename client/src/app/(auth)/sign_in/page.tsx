"use client";

import { clearAdminData } from "@/redux/adminSlice";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import { useCekLogin } from "@/utils/cekAuth";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const SignIn = () => {
  useCekLogin();
  const dispatch = useDispatch<AppDispatch>();
  const Router = useRouter();
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.email) {
      setError((prev) => ({
        ...prev,
        email: "Input Email Is Required",
      }));
      return;
    }
    if (!input.password) {
      setError((prev) => ({
        ...prev,
        password: "Input Password Is Required",
      }));
      return;
    }
    dispatch(showLoading());
    e.preventDefault();
    try {
      const data = {
        email: input.email,
        password: input.password,
        remember,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`,
        data,
        { withCredentials: true }
      );

      dispatch(showNotif({ message: "Login Success", type: "success" }));
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout/admin`,
        {},
        { withCredentials: true }
      );
      dispatch(clearAdminData());
      return Router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ message?: string }>;

        if (error.response?.status === 404) {
          return dispatch(
            showNotif({ message: "Email Or Password Wrong", type: "error" })
          );
        }

        return dispatch(
          showNotif({
            message: error.response?.data?.message ?? "Server Error",
            type: "error",
          })
        );
      }

      return dispatch(
        showNotif({ message: "Unexpected Error", type: "error" })
      );
    } finally {
      return setTimeout(() => {
        dispatch(hideLoading());
      }, 500);
    }
  };
  return (
    <div className="py-10 w-full">
      <div className="text-center flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold">Sign in to your account</h1>
        <p>
          Or{" "}
          <Link
            href={"/sign_up"}
            className="decoration-solid underline hover:no-underline"
          >
            sign up for a new account
          </Link>
        </p>
      </div>
      <div className="flex justify-center">
        <div className="w-11/12 sm:w-2/3 md:w-2/4 lg:w-1/3 p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <form
            action=""
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            method="post"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 "
              >
                Email
              </label>
              <input
                placeholder="Email"
                type="email"
                value={input.email}
                name="email"
                onChange={handleChange}
                className="block w-full border rounded-md py-2 px-3 focus:outline-hidden dark:bg-gray-700/50 dark:border-gray-500 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 dark-form-input"
              />
              <p className="text-sm text-red-600 dark:text-red-500">
                {error.email ?? ""}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 "
              >
                Password
              </label>
              <input
                placeholder="Password"
                type="password"
                value={input.password}
                name="password"
                onChange={handleChange}
                className="block w-full border rounded-md py-2 px-3 focus:outline-hidden dark:bg-gray-700/50 dark:border-gray-500 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 dark-form-input"
              />
              <p className="text-sm text-red-600 dark:text-red-500">
                {error.password ?? ""}
              </p>
            </div>
            <div className="flex w-full justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-normal md:font-medium"
                >
                  Remember Me
                </label>
              </div>
              <div>
                <Link
                  href="/users/password_reset/new"
                  className="md:font-medium font-normal text-sm underline decoration-solid"
                >
                  Forget Your Password?
                </Link>
              </div>
            </div>
            <div className="">
                <button
                  className="py-3 w-full cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-700 duration-500 rounded-md"
                  type="submit"
                >
                  Sign In
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
