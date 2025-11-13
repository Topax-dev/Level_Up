"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Heart,
  Home,
  LogIn,
  LogOut,
  Map,
  Menu,
  MessageCircleMore,
  Moon,
  Rocket,
  Settings,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { showNotif } from "@/redux/notifSlice";
import { clearUserData } from "@/redux/userSlice";
import axios from "axios";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { clearAdminData } from "@/redux/adminSlice";

const NavbarDashboard = ({ avatar }: { avatar: string }) => {
  const [tema, setTema] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [navbar, setNavbar] = useState(true);
  const [profile, setProfile] = useState(false);
  const adminId = useSelector((state: RootState) => state.admin.id);
  const userId = useSelector((state: RootState) => state.user.id);
  const Router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setMounted(true);

    const savedTema = localStorage.getItem("tema") as "light" | "dark" | null;
    if (savedTema) {
      setTema(savedTema);
      document.documentElement.classList.toggle("dark", savedTema === "dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTema("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleNavbarProfile = () => {
    setNavbar(true);
    setProfile(false);
  };

  const handleLogoutUser = async () => {
    setMounted(false);
    dispatch(showLoading());
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(showNotif({ message: "Logout Success", type: "success" }));
      dispatch(clearUserData());
      await Router.push("/");
    } catch (err) {
      console.log(err);
      dispatch(showNotif({ message: "Logout Failed", type: "error" }));
    } finally {
      setTimeout(() => {
        setMounted(true);
        dispatch(hideLoading());
      }, 500);
    }
  };

  const handleLogoutAdmin = async () => {
    setMounted(false);
    dispatch(showLoading());
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout/admin`,
        {},
        { withCredentials: true }
      );
      dispatch(showNotif({ message: "Logout Success", type: "success" }));
      dispatch(clearAdminData());
      await Router.push("/");
    } catch (error) {
      console.log(error);
      dispatch(showNotif({ message: "Logout Failed", type: "error" }));
    } finally {
      setTimeout(() => {
        setMounted(true);
        dispatch(hideLoading());
      }, 500);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("tema", tema);
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema, mounted]);

  const toggleTema = () => {
    setTema((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="sticky w-full z-30">
      {avatar ? (
        <div className="navbar flex items-center h-16 bg-white dark:bg-gray-900 justify-between lg:px-15 px-5">
          <div className="logo">
            <h2 className="text-4xl font-bold">LevelUp.</h2>
          </div>

          <div
            className="cursor-pointer lg:hidden"
            onClick={() => setNavbar(!navbar)}
          >
            <Menu size={20} />
          </div>

          <nav className="lg:block hidden">
            <ul className="flex gap-10 items-center">
              <li>
                <Link
                  href={adminId ? "/dashboard/admin" : "/dashboard"}
                  className="font-medium text-sm"
                  onClick={() => setProfile(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/paths"
                  className="font-medium text-sm"
                  onClick={() => setProfile(false)}
                >
                  All Paths
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="font-medium text-sm"
                  onClick={() => setProfile(false)}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/support_us"
                  className="font-medium text-sm"
                  onClick={() => setProfile(false)}
                >
                  Support Us
                </Link>
              </li>
              <div className="cursor-pointer" onClick={toggleTema}>
                {tema === "light" ? <Moon size={26} /> : <Sun size={26} />}
              </div>

              <div>
                <Image
                  alt="Foto Default"
                  src={
                    avatar
                      ? avatar
                      : `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/defaultAvatar.png`
                  }
                  width={1000}
                  height={1000}
                  className={`w-10 rounded-full cursor-pointer aspect-square object-cover`}
                  onClick={() => setProfile(!profile)}
                />
              </div>
            </ul>
            <div
              className={`absolute top-15 right-15 shadow py-2 px-4 bg-white dark:bg-gray-800 ${
                profile ? `opacity-100 visible` : "opacity-0 invisible"
              } cursor-pointer rounded-sm`}
            >
              <Link
                href={adminId ? "/dashboard/admin/profile" : "/dashboard/users/profile"}
                className="flex items-center min-w-38 gap-3 h-10"
                onClick={() => setProfile(false)}
              >
                <Settings size={20} />
                <div>Settings</div>
              </Link>
              {adminId && userId ? (
                <div>
                  <div
                    className="flex items-center min-w-38 gap-3 h-10"
                    onClick={handleLogoutAdmin}
                  >
                    <LogOut size={20} />
                    <div>Sign Out (Admin)</div>
                  </div>

                  <div
                    className="flex items-center min-w-38 gap-3 h-10"
                    onClick={handleLogoutUser}
                  >
                    <LogOut size={20} />
                    <div>Sign Out (User)</div>
                  </div>
                </div>
              ) : adminId ? (
                <div
                  className="flex items-center w-38 gap-3 h-10"
                  onClick={handleLogoutAdmin}
                >
                  <LogOut size={20} />
                  <div>Sign Out</div>
                </div>
              ) : (
                <div
                  className="flex items-center w-38 gap-3 h-10"
                  onClick={handleLogoutUser}
                >
                  <LogOut size={20} />
                  <div>Sign Out</div>
                </div>
              )}
            </div>
          </nav>

          <div
            onClick={() => setNavbar(true)}
            className={`fixed top-0 left-0 right-0 bottom-0 ${
              navbar ? "hidden" : "bg-gray-400 dark:bg-black"
            }`}
          ></div>

          <nav
            className={`fixed top-0 left-0 h-dvh w-10/12 bg-white dark:bg-gray-900 
          transform transition-transform duration-300 
          ${
            navbar ? "-translate-x-full" : "translate-x-0"
          } lg:-translate-x-full`}
          >
            <div className="logo flex justify-between items-center py-5 px-3">
              <h2 className="text-4xl font-bold">LevelUp.</h2>
              <div className="cursor-pointer" onClick={() => setNavbar(true)}>
                <X size={36} />
              </div>
            </div>

            <ul className="px-1 py-4 gap-1 flex flex-col">
              <Link
                className="p-3 flex gap-5 items-center"
                href={adminId ? "/dashboard/admin" : "/dashboard"}
                onClick={() => setNavbar(true)}
              >
                <Map size={24} /> <div>Dashboard</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/paths"
                onClick={() => setNavbar(true)}
              >
                <Building2 size={24} /> <div>All Paths</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/community"
                onClick={() => setNavbar(true)}
              >
                <MessageCircleMore size={24} /> <div>Community</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/support_us"
                onClick={() => setNavbar(true)}
              >
                <Heart size={24} /> <div>Support Us</div>
              </Link>
            </ul>

            <hr />

            <ul className="px-1 py-4 gap-1 flex flex-col">
              <Link
                href={"/dashboard/users/profile"}
                className="p-3 flex gap-5 items-center"
                onClick={handleNavbarProfile}
              >
                <Settings size={24} />
                <div>Settings</div>
              </Link>
              <div
                className="p-3 flex gap-5 items-center cursor-pointer"
                onClick={toggleTema}
              >
                {tema === "light" ? <Moon size={24} /> : <Sun size={24} />}
                <div>{tema === "light" ? "Light" : "Dark"} Mode</div>
              </div>
              <div className="ml-1">
                {adminId && userId ? (
                  <div>
                    <div
                      className="p-3 flex gap-5 items-center cursor-pointer"
                      onClick={handleLogoutAdmin}
                    >
                      <LogOut size={24} />
                      <div>Sign Out (Admin)</div>
                    </div>
                    <div
                      className="p-3 flex gap-5 items-center cursor-pointer"
                      onClick={handleLogoutUser}
                    >
                      <LogOut size={24} />
                      <div>Sign Out (User)</div>
                    </div>
                  </div>
                ) : adminId ? (
                  <div
                    className="p-3 flex gap-5 items-center cursor-pointer"
                    onClick={handleLogoutAdmin}
                  >
                    <LogOut size={24} />
                    <div>Sign Out</div>
                  </div>
                ) : (
                  <div
                    className="p-3 flex gap-5 items-center cursor-pointer"
                    onClick={handleLogoutUser}
                  >
                    <LogOut size={24} />
                    <div>Sign Out</div>
                  </div>
                )}
              </div>
            </ul>
          </nav>
        </div>
      ) : (
        <div className="navbar flex items-center h-16 bg-white dark:bg-gray-900 justify-between lg:px-15 px-5">
          <div className="logo">
            <h2 className="text-4xl font-bold">LevelUp.</h2>
          </div>

          <div
            className="cursor-pointer lg:hidden"
            onClick={() => setNavbar(!navbar)}
          >
            <Menu size={20} />
          </div>

          <nav className="lg:block hidden">
            <ul className="flex gap-10 items-center">
              <li>
                <Link href="/paths" className="font-medium text-sm">
                  All Paths
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/community" className="font-medium text-sm">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/support_us" className="font-medium text-sm">
                  Support Us
                </Link>
              </li>
              <li>
                <Link href="/sign_in" className="font-medium text-sm">
                  Sign In
                </Link>
              </li>

              <div className="cursor-pointer" onClick={toggleTema}>
                {tema === "light" ? <Moon size={26} /> : <Sun size={26} />}
              </div>

              <div>
                <Link
                  href="/sign_up"
                  className="cursor-pointer px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 duration-500 rounded-sm"
                >
                  Get Started
                </Link>
              </div>
            </ul>
          </nav>

          <div
            onClick={() => setNavbar(true)}
            className={`fixed top-0 left-0 right-0 bottom-0 ${
              navbar ? "hidden" : "bg-gray-400 dark:bg-black"
            }`}
          ></div>

          <nav
            className={`fixed top-0 left-0 h-dvh w-96 bg-white dark:bg-gray-900 
          transform transition-transform duration-300 
          ${
            navbar ? "-translate-x-full" : "translate-x-0"
          } lg:-translate-x-full`}
          >
            <div className="logo flex justify-between items-center py-5 px-3">
              <h2 className="text-4xl font-bold">LevelUp.</h2>
              <div className="cursor-pointer" onClick={() => setNavbar(true)}>
                <X size={36} />
              </div>
            </div>

            <ul className="px-1 py-4 gap-1 flex flex-col">
              <Link
                className="p-3 flex gap-5 items-center"
                href="/"
                onClick={() => setNavbar(false)}
              >
                <Home size={24} /> <div>Home</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/paths"
                onClick={() => setNavbar(false)}
              >
                <Map size={24} /> <div>All Paths</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/about"
                onClick={() => setNavbar(false)}
              >
                <Building2 size={24} /> <div>About</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/community"
                onClick={() => setNavbar(false)}
              >
                <MessageCircleMore size={24} /> <div>Community</div>
              </Link>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/support_us"
                onClick={() => setNavbar(false)}
              >
                <Heart size={24} /> <div>Support Us</div>
              </Link>
            </ul>

            <hr />

            <ul className="px-1 py-4 gap-1 flex flex-col">
              <Link
                className="p-3 flex gap-5 items-center"
                href="/sign_in"
                onClick={() => setNavbar(false)}
              >
                <Rocket size={24} /> <div>Sign In</div>
              </Link>
              <div
                className="p-3 flex gap-5 items-center cursor-pointer"
                onClick={toggleTema}
              >
                {tema === "light" ? <Moon size={24} /> : <Sun size={24} />}
                <div>{tema === "light" ? "Light" : "Dark"} Mode</div>
              </div>
              <Link
                className="p-3 flex gap-5 items-center"
                href="/sign_up"
                onClick={() => setNavbar(false)}
              >
                <LogIn size={24} /> <div>Get Started</div>
              </Link>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavbarDashboard;
