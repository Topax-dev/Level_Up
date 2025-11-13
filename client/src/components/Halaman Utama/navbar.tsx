"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Heart,
  Home,
  LogIn,
  Map,
  Menu,
  MessageCircleMore,
  Moon,
  Rocket,
  Sun,
  X,
} from "lucide-react";

const Navbar = () => {
  const [tema, setTema] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [navbar, setNavbar] = useState(true);

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
    <div className="sticky w-full">
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
            <Link className="p-3 flex gap-5 items-center" href="/" onClick={() => setNavbar(false)}>
              <Home size={24} /> <div>Home</div>
            </Link>
            <Link className="p-3 flex gap-5 items-center" href="/paths" onClick={() => setNavbar(false)}>
              <Map size={24} /> <div>All Paths</div>
            </Link>
            <Link className="p-3 flex gap-5 items-center" href="/about" onClick={() => setNavbar(false)}>
              <Building2 size={24} /> <div>About</div>
            </Link>
            <Link className="p-3 flex gap-5 items-center" href="/community" onClick={() => setNavbar(false)}>
              <MessageCircleMore size={24} /> <div>Community</div>
            </Link>
            <Link className="p-3 flex gap-5 items-center" href="/support_us" onClick={() => setNavbar(false)}>
              <Heart size={24} /> <div>Support Us</div>
            </Link>
          </ul>

          <hr />

          <ul className="px-1 py-4 gap-1 flex flex-col">
            <Link className="p-3 flex gap-5 items-center" href="/sign_in" onClick={() => setNavbar(false)}>
              <Rocket size={24} /> <div>Sign In</div>
            </Link>
            <div
              className="p-3 flex gap-5 items-center cursor-pointer"
              onClick={toggleTema}
            >
              {tema === "light" ? <Moon size={24} /> : <Sun size={24} />}
              <div>{tema === "light" ? "Light" : "Dark"} Mode</div>
            </div>
            <Link className="p-3 flex gap-5 items-center" href="/sign_up" onClick={() => setNavbar(false)}>
              <LogIn size={24} /> <div>Get Started</div>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
