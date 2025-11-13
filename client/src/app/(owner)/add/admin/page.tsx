"use client";

import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    try {
      const email = validator.isEmail(input.email);
      if (!email) {
        setError((prev) => ({
          ...prev,
          email: "Email Is Not True",
        }));
        return
      }
      if (!input.name) {
        setError((prev) => ({
          ...prev,
          name: "Username field is required",
        }));
        return;
      }
      if (input.name.length < 7) {
        setError((prev) => ({
          ...prev,
          name: "Username must not be less than 7 words",
        }));
        return;
      }
      if (!input.password) {
        setError((prev) => ({
          ...prev,
          password: "Pasword field is required",
        }));
        return;
      }
      if (input.password.length < 8) {
        setError((prev) => ({
          ...prev,
          password: "Password must be less than 8 words",
        }));
        return;
      }

      if (input.confirmPassword !== input.password) {
        setError((prev) => ({
          ...prev,
          confirmPassword: "Password is not match",
        }));
        return;
      }
      dispatch(showLoading());
      const data = {
        name: input.name,
        email: input.email,
        password: input.password,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin`, data);
      dispatch(
        showNotif({ message: "Create account succesfuly", type: "success" })
      );
      return setInput(prev => ({
        ...prev,
        name : '',
        confirmPassword : '',
        email : '',
        password : ''
      }))
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.status === 403) {
          return dispatch(showNotif({ message : 'Username Or Email Already Exist', type : 'info' }))
        }
      }
      console.log(error);
    } finally {
      setTimeout(() => {
        dispatch(hideLoading());
      }, 500);
    }
  };
  return (
    <div className="py-10 w-full">
      <div className="text-center flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold">Create Admin Account</h1>
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
                Username
              </label>
              <input
                placeholder="Username"
                type="text"
                value={input.name}
                name="name"
                onChange={handleChange}
                className="block w-full border rounded-md py-2 px-3 focus:outline-hidden dark:bg-gray-700/50 dark:border-gray-500 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 dark-form-input"
              />
              <p className={`text-sm text-red-600 dark:text-red-500`}>
                {error.name ?? ""}
              </p>
            </div>
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
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 "
              >
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                type="password"
                value={input.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                className="block w-full border rounded-md py-2 px-3 focus:outline-hidden dark:bg-gray-700/50 dark:border-gray-500 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:ring-2 dark:focus:border-transparent border-gray-300 focus:ring-blue-600 focus:border-blue-600 dark:focus:ring-blue-400 dark-form-input"
              />
              <p className="text-sm text-red-600 dark:text-red-500">
                {error.confirmPassword ?? ""}
              </p>
            </div>
            <div className="">
              <button
                type="submit"
                className="py-3 w-full cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-700 duration-500 rounded-md"
              >
                Create Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
