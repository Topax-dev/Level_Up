"use client";

import Loading from "@/components/loading";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { clearUserData } from "@/redux/userSlice";
import { useCekAuth } from "@/utils/cekAuth";
import axios from "axios";
import { KeyRound, RotateCcw, Trash, UserPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";

const DEFAULT_AVATAR = `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/defaultAvatar.png`;

const Profile = () => {
  useCekAuth();
  const Router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const [input, setInput] = useState({
    username: "",
    email: "",
    purpose: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    purpose: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(DEFAULT_AVATAR);
  const [popResetProgress, setPopResetProgress] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popDelete, setPopDelate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function getImageUrl(url: string | undefined | null) {
    if (!url) return DEFAULT_AVATAR;
    if (/^https?:\/\//i.test(url)) return url;
    const prefix = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
      /\/+$/,
      ""
    );
    if (!prefix) return url.startsWith("/") ? url : `/${url}`;
    return url.startsWith("/") ? `${prefix}${url}` : `${prefix}/${url}`;
  }

  useEffect(() => {
    setInput({
      username: user.username || "",
      email: user.email || "",
      purpose: user.purpose || "",
    });

    let objectUrl: string | null = null;

    if (avatar) {
      objectUrl = URL.createObjectURL(avatar);
      setAvatarPreview(objectUrl);
    } else if (user.avatar) {
      setAvatarPreview(getImageUrl(user.avatar));
    } else {
      setAvatarPreview(DEFAULT_AVATAR);
    }

    setMounted(true);

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user, avatar]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(showLoading());
    try {
      const email = validator.isEmail(input.email);
      if (!email) {
        setError((prev) => ({
          ...prev,
          email: "Email Is Not True",
        }));
        return;
      }
      if (!input.username) {
        setError((prev) => ({
          ...prev,
          username: "Username field is required",
        }));
        return;
      }
      if (input.username.length < 7) {
        setError((prev) => ({
          ...prev,
          username: "Username must not be less than 7 words",
        }));
        return;
      }
      if (input.purpose.length < 12) {
        setError((prev) => ({
          ...prev,
          purpose: "Learning Goal must not be less than 12 words",
        }));
        return;
      }

      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("email", input.email);
      formData.append("purpose", input.purpose);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        dispatch(
          showNotif({ message: "Update User Success", type: "success" })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(showNotif({ message: "Update User Failed", type: "error" }));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDelete = () => {
    setPopDelate(true);
  };

  const handleFixDelete = async () => {
    try {
      setMounted(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user.id}`,
        { withCredentials: true }
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(
          showNotif({ message: "Delete Account Successfully", type: "success" })
        );
        dispatch(clearUserData());
        setPopDelate(false);
        Router.push("/");
      } else {
        dispatch(
          showNotif({ message: "Delete Account Failed", type: "error" })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(showNotif({ message: "Server Error", type: "error" }));
    } finally {
      setMounted(false);
    }
  };

  const handleResetProgress = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/progress/reset-progress/${user.id}`
      );
      if (response.status === 200) {
        dispatch(
          showNotif({ message: "Delete Progress Succesfully", type: "success" })
        );
      } else {
        dispatch(
          showNotif({ message: "Delete Progress Failed", type: "error" })
        );
      }
    } catch (error) {
      console.log(error);
      return dispatch(showNotif({ message: "Server Error", type: "error" }));
    }
  };

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="w-full xl:p-16 py-10 px-5 flex flex-col xl:flex-row">
      <div className="flex flex-col gap-2 flex-1 lg:pr-5 mb-5 lg:mb-0">
        <Link
          href={""}
          className="flex items-center gap-5 py-3 px-4 xl:w-72 w-full bg-gray-200 dark:bg-gray-800 font-medium rounded-sm"
        >
          <UserPen />
          <div className="text-md font-medium">Profile</div>
        </Link>
        <Link
          href={"/dashboard/users/password/new"}
          className="flex items-center gap-5 py-3 px-4 xl:w-72 w-full dark:hover:bg-gray-800 font-medium rounded-sm"
        >
          <KeyRound />
          <div className="text-md font-medium">Password</div>
        </Link>
      </div>

      <div className="flex flex-col flex-4 gap-8">
        <div className="shadow border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 bg-white">
          <form action="" method="post" className="" onSubmit={handleUpdate}>
            <div className="lg:p-8 p-4">
              <div className="flex flex-col gap-2 mb-8">
                <div className="font-medium text-2xl">Profile</div>
                <div className="font-medium text-sm dark:text-gray-400 text-gray-500">
                  Profile Information Will Be Displayed In Your Dashboard
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Avatar</label>
                <div
                  className="w-16 h-16 rounded-full cursor-pointer overflow-hidden"
                  onClick={openFileExplorer}
                >
                  <Image
                    alt="User Avatar"
                    src={avatarPreview}
                    width={50}
                    height={50}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Username</label>
                <input
                  type="text"
                  value={input.username}
                  onChange={handleChange}
                  placeholder="Username"
                  name="username"
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.username ?? ""}
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Email</label>
                <input
                  type="email"
                  value={input.email}
                  onChange={handleChange}
                  placeholder="Email"
                  name="email"
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.email ?? ""}
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="font-medium text-sm">Learning Goal</label>
                <textarea
                  name="purpose"
                  value={input.purpose}
                  onChange={handleChange}
                  className="outline-0 w-full py-2 px-3 border border-gray-300 dark:border-gray-500 dark:bg-gray-700/50 font-medium text-md rounded-sm min-h-44"
                />
                <p className={`text-sm text-red-600 dark:text-red-500`}>
                  {error.purpose ?? ""}
                </p>
              </div>
            </div>

            <footer className="w-full bg-gray-200/50 dark:bg-gray-700/50 py-2 px-3 flex justify-end rounded-b-sm">
              <button
                type="submit"
                className="py-2 px-7 cursor-pointer bg-gray-300 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 duration-500 rounded-md"
              >
                Save
              </button>
            </footer>
          </form>
        </div>

        <div className="lg:p-8 p-4 min-h-64 shadow border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 bg-white">
          <div className="flex flex-col gap-3 mb-6">
            <div className="font-medium text-2xl">Danger Zone</div>
            <div className="font-medium text-sm dark:text-gray-400 text-gray-500">
              Careful, these actions can not be undone.
            </div>
          </div>

          <div className="flex flex-col gap-5 w-fit">
            <button
              className="py-2 px-3 shadow border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 flex items-center gap-2 cursor-pointer"
              onClick={() => setPopResetProgress(true)}
            >
              <RotateCcw className="text-red-500" /> Reset Progress
            </button>

            <button
              onClick={handleDelete}
              className="py-2 px-3 shadow border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 flex items-center gap-2 cursor-pointer"
            >
              <Trash className="text-red-500" /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-gray-900/70 ${
          popDelete ? "visible z-10" : "invisible -z-10"
        } flex justify-center items-center`}
        onClick={() => setPopDelate(false)}
      >
        <div
          className="max-w-96 max-h-44 dark:bg-gray-900 bg-gray-200 z-20 px-7 py-5 flex flex-col gap-7 rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-medium text-center">
              Are You Sure?
            </div>
            <div className="font-medium text-sm dark:text-gray-400 text-gray-500">
              Your Account Will Deleted Permantly
            </div>
          </div>

          <div className="flex gap-4 justify-between items-center">
            <button
              className="py-2 px-10 cursor-pointer dark:text-gray-200 text-gray-100 dark:bg-red-500 bg-red-700 duration-500 rounded-md"
              onClick={handleFixDelete}
            >
              Yes
            </button>
            <button
              className="py-2 px-10 cursor-pointer border border-gray-700 duration-500 rounded-md"
              onClick={() => setPopDelate(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      {popResetProgress && (
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 bg-gray-900/70 z-10 flex justify-center items-center`}
          onClick={() => setPopResetProgress(false)}
        >
          <div
            className="max-w-96 max-h-44 dark:bg-gray-900 bg-gray-200 z-20 px-7 py-5 flex flex-col gap-7 rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium text-center">
                Are You Sure?
              </div>
              <div className="font-medium text-sm text-center dark:text-gray-400 text-gray-500">
                Your Progress Will Be Deleted
              </div>
            </div>

            <div className="flex gap-4 justify-between items-center">
              <button
                className="py-2 px-10 cursor-pointer dark:text-gray-200 text-gray-100 dark:bg-red-500 bg-red-700 duration-500 rounded-md"
                onClick={() => {
                  handleResetProgress();
                  setPopResetProgress(false)
                }}
              >
                Yes
              </button>
              <button
                className="py-2 px-10 cursor-pointer border border-gray-700 duration-500 rounded-md"
                onClick={() => setPopResetProgress(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
