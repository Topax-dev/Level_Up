"use client";

import { IAdminSlice } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { Plus, User, Calendar, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";

const AllAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [admin, setAdmin] = useState<IAdminSlice[]>([]);
  const [search, setSearch] = useState("");

  // Fetch data sekali saja
  useEffect(() => {
    const getAllAdmin = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin`
        );
        if (response.status === 200) {
          setAdmin(response.data[0].payload);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getAllAdmin();
  }, [dispatch]);

  const filteredAdmin = useMemo(() => {
    if (!search.trim()) return admin;
    return admin.filter((e) =>
      e.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, admin]);

  return (
    <div className="py-10 xl:px-55 lg:px-40 md:px-5 px-4">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center dark:text-gray-200 mb-3">
          All Admin
        </h2>
        <p className="text-center dark:text-gray-400 text-gray-600 mb-8">
          Manage and organize All Admin
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Link href={"/add/admin"} className="md:w-auto w-full">
            <button className="flex items-center justify-center gap-2 bg-white w-full dark:border-gray-600/50 border border-gray-200 dark:bg-gray-800 py-3.5 px-6 cursor-pointer rounded-md hover:shadow-lg transition-all duration-300 font-semibold dark:text-gray-200">
              <Plus size={20} strokeWidth={2.5} />
              <span>Add New Admin</span>
            </button>
          </Link>
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search admin by username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border w-full rounded-md py-3.5 px-5 outline-none border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600/50 dark:text-gray-300 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div
        className={`grid ${
          filteredAdmin.length === 0
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        } gap-5`}
      >
        {filteredAdmin.length > 0 ? (
          filteredAdmin.map((e) => (
            <div
              key={e.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600/50 rounded-lg p-6 hover:shadow-xl transition-all duration-300 group relative"
            >
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    width={80}
                    height={80}
                    alt="Admin Image"
                    src={e.avatar}
                    className="w-full h-full object-cover rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-2 truncate">
                    {e.username}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      {e.role}
                    </span>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} />
                      <span>
                        {new Date(e.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 right-4">
                <button className="dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-600 border transition-colors rounded-full p-1.5 cursor-pointer shadow-md">
                  <Trash
                    size={18}
                    strokeWidth={2}
                    className="dark:text-white text-black"
                  />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-gray-400 mb-4">
              <User size={64} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Admin Found
            </h2>
            <p className="text-gray-400 text-center">
              {search
                ? "Try adjusting your search terms"
                : "Start by adding a new admin"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAdmin;
