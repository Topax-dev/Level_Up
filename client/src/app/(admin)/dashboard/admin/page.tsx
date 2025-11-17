"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useCekAuthAdminAndOwner } from "@/utils/cekAuth";
import {
  BookOpen,
  GraduationCap,
  Route,
  Users,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";
import { IAdminDashboard } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import axios from "axios";

const Dashboard = () => {
  useCekAuthAdminAndOwner();
  const dispatch = useDispatch<AppDispatch>();
  const admin = useSelector((state: RootState) => state.admin);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [dataDashboard, setDataDashboard] = useState<IAdminDashboard>();
  useEffect(() => {
    const getDataDashboard = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard/admin`
        );
        if (response.status === 200) {
          setDataDashboard(response.data[0].payload);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getDataDashboard();
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const menuItems = [
    {
      title: "Learning Paths",
      description: "Manage learning pathways and progression",
      icon: Route,
      href: "/all/paths",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Courses",
      description: "Create and organize course content",
      icon: BookOpen,
      href: "/all/courses",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Lessons",
      description: "Build detailed lesson materials",
      icon: GraduationCap,
      href: "/all/lessons",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Sections",
      description: "Create and organie section",
      icon: BarChart3,
      href: "/all/sections",
      gradient: "from-pink-500 to-pink-600",
    },
    ...(admin.role === "owner"
      ? [
          {
            title: `All Admin`,
            description: `Manage Admin Data`,
            icon: Users,
            href: `/all/admin`,
            gradient: "from-orange-500 to-orange-600",
          },
        ]
      : []),
    {
      title: "Action",
      description: "Look actions",
      icon: FileText,
      href: `/${admin.role === "admin" ? "dashboard/admin" : "all"}/actions`,
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    {
      label: "Learning Paths",
      value: `${dataDashboard?.totalPath ?? "-"}`,
      icon: Route,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Active Courses",
      value: `${dataDashboard?.totalCourse ?? "-"}`,
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Total Lessons",
      value: `${dataDashboard?.totalLesson ?? "-"}`,
      icon: GraduationCap,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      label: "User",
      value: `${dataDashboard?.totalUser ?? "-"}`,
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    ...(admin.role === "owner"
      ? [
          {
            label: "Total Admin",
            value: `${dataDashboard?.totalAdmin ?? "-"}`,
            icon: Users,
            color: "text-pink-500",
            bg: "bg-pink-50 dark:bg-pink-500/10",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-2">
            <div className="text-center">
              <h1 className="text-4xl font-bold">
                {admin.role === "admin" ? "Admin" : "Owner"} Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Welcome back! Manage your learning platform
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="rounded-lg shadow-xl p-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute rounded-md"></div>
                  <Image
                    src={
                      admin.avatar && admin.avatar.trim() !== ""
                        ? admin.avatar
                        : `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/defaultAvatar.png`
                    }
                    width={500}
                    height={500}
                    className="relative w-20 h-20 rounded-full object-cover"
                    alt="Avatar"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                    {admin.username || "Not Logged In Yet"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {admin.role === "admin" ? "Administrator" : "Owner"}
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last Login
                    </p>
                    <p className="text-sm font-semibold dark:text-white text-gray-900">
                      Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={24} />
            Overview
          </h2>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              admin.role === "admin" ? "lg:grid-cols-4" : "lg:grid-cols-5"
            } gap-4`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <Icon className={stat.color} size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold dark:text-white text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`absolute opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-gray-300 dark:text-gray-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
