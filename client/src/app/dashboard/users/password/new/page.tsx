"use client";

import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { KeyRound, UserPen } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotif } from "@/redux/notifSlice";
import { useCekAuth } from "@/utils/cekAuth";
import { hideLoading, showLoading } from "@/redux/loadingSlice";

const ResetPassword = () => {
  useCekAuth()
  const user = useSelector((state : RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const [input, setInput] = useState({
    currentPassword: "",
    newPassword: "",
    matchPassword: "",
  });
  const [error, setError] = useState({
    currentPassword: "",
    newPassword: "",
    matchPassword: "",
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
      currentPassword: "",
      newPassword: "",
      matchPassword: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    dispatch(showLoading())
    e.preventDefault();
    try {
      if (!input.currentPassword) {
        return setError((prev) => ({
          ...prev,
          currentPassword: "Field Current Password Is Required",
        }));
      }
      if (!input.newPassword) {
        return setError((prev) => ({
          ...prev,
          newPassword: "Field New Password Is Required",
        }));
      }
      if (!input.matchPassword) {
        return setError((prev) => ({
          ...prev,
          matchPassword: "Field Repeat Password Is Required",
        }));
      }
      if (input.currentPassword.length < 8) {
        return setError((prev) => ({
          ...prev,
          currentPassword: "Your Password Is More Than 8 Words, Right?",
        }));
      }
      if (input.newPassword.length < 8) {
        return setError((prev) => ({
          ...prev,
          newPassword: "New Password Must Be Less Than 8 Words",
        }));
      }
      if (input.newPassword !== input.matchPassword) {
        return setError((prev) => ({
          ...prev,
          matchPassword: "Password Does Not Match",
        }));
      }

      const data = {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword
      }
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/edit/password/${user.id}`, data)
      if(response.data[0].payload.status_code=== 401) {
        return dispatch(showNotif({message: 'Wrong Password', type: 'error'}))
      }

      return dispatch(showNotif({message: 'Update Password Success', type: 'success'}))
    } catch (error) {
      console.log(error);
    } finally {
      setInput(prev => ({
        ...prev,
        currentPassword: '',
        matchPassword: '',
        newPassword : ''
      }))
      dispatch(hideLoading())
    }
  };
  return (
    <div className="w-full py-10 px-5 lg:p-16 flex lg:flex-row flex-col">
      <div className="flex flex-col gap-2 flex-1 lg:pr-5 mb-5 lg:mb-0">
        <Link
          href={"/dashboard/users/profile"}
          className="flex items-center gap-5 py-3 px-4 w-full lg:w-72 dark:bg-gray-900 hover:dark:bg-gray-800 font-medium rounded-sm"
        >
          <UserPen />
          <div className="text-md font-medium">Profile</div>
        </Link>
        <Link
          href={"/dashboard/users/password/new"}
          className="flex items-center gap-5 py-3 px-4 lg:w-72 w-full dark:bg-gray-800 font-medium rounded-sm"
        >
          <KeyRound />
          <div className="text-md font-medium">Password</div>
        </Link>
      </div>
      <div className="flex flex-col flex-4 gap-8">
        <div className="shadow border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 bg-white">
          <form action="" method="post" onSubmit={handleSubmit}>
            <div className="lg:p-8 p-4">
              <div className="flex flex-col gap-2 mb-8">
                <div className="font-medium text-2xl">Change Your Password</div>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Current Password</label>
                <input
                  type="password"
                  value={input.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                  name="currentPassword"
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.currentPassword ?? ""}
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">New Password</label>
                <input
                  type="password"
                  value={input.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  name="newPassword"
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.newPassword ?? ""}
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Repeat Password</label>
                <input
                  type="password"
                  value={input.matchPassword}
                  onChange={handleChange}
                  placeholder="Repeat Your New Password"
                  name="matchPassword"
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.matchPassword ?? ""}
                </p>
              </div>
            </div>
            <footer className="w-full bg-gray-200/50 dark:bg-gray-700/50 py-2 px-3 flex justify-end rounded-b-sm">
              <button
                type="submit"
                className="py-2 px-7 cursor-pointer bg-gray-300 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 duration-500 rounded-md"
              >
                Submit
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
