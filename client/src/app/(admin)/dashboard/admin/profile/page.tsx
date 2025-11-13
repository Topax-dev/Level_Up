"use client";

import Loading from "@/components/loading";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useCekAuthAdminAndOwner } from "@/utils/cekAuth";
import axios from "axios";
import { KeyRound,  UserPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";

const DEFAULT_AVATAR = `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/defaultAvatar.png`;

const Profile = () => {
  useCekAuthAdminAndOwner();
  const dispatch = useDispatch<AppDispatch>();
  const admin = useSelector((state: RootState) => state.admin);

  const [input, setInput] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(DEFAULT_AVATAR);

  const [mounted, setMounted] = useState(false);

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
      username: admin.username || "",
      email: admin.email || "",
    });

    let objectUrl: string | null = null;

    if (avatar) {
      objectUrl = URL.createObjectURL(avatar);
      setAvatarPreview(objectUrl);
    } else if (admin.avatar) {
      setAvatarPreview(getImageUrl(admin.avatar));
    } else {
      setAvatarPreview(DEFAULT_AVATAR);
    }

    setMounted(true);

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [admin, avatar]);

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

      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("email", input.email);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/${admin.id}`,
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
          showNotif({ message: "Update Admin Success", type: "success" })
        );
      }
    } catch (err) {
      if(axios.isAxiosError(err)) {
        if(err.status === 403) {
          return dispatch(showNotif({ message : 'Username Or Email Already Exist', type :'info' }))
        }
      }
      console.log(err);
      dispatch(showNotif({ message: "Update Admin Failed", type: "error" }));
    } finally {
      dispatch(hideLoading());
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
          href={"/dashboard/admin/password/new"}
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
                    width={500}
                    height={500}
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
      </div>
    </div>
  );
};

export default Profile;
