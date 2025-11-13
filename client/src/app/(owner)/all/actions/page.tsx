"use client";

import { IAllActionAdmin } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { ArrowDown, Clock, Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AllActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [action, setAction] = useState<IAllActionAdmin[]>([]);
  const [category, setCategory] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    add: true,
    update: true,
    delete: true,
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getAllActionAdmin = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin`
        );
        setAction(response.data[0].payload)
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getAllActionAdmin();
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin?search=${search}&add=${inputCheck.add}&del=${inputCheck.delete}&update=${inputCheck.update}`
      );
      setAction(response.data[0].payload);
      console.log(response)
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, inputCheck.add, inputCheck.delete, inputCheck.update]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setInputCheck((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "Add":
        return <Plus className="w-5 h-5" />;
      case "Update":
        return <Edit className="w-5 h-5" />;
      case "Delete":
        return <Trash2 className="w-5 h-5" />;
      default:
        return null;
    }
  };
  return (
    <div className="py-10 xl:px-55 lg:px-40 md:px-5 px-4">
      <div className="mb-5">
        <h1 className="text-4xl font-bold text-center dark:text-gray-200 mb-3">
          All Actions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
          View and monitor every administrative action performed by all admins
          in the system. You can search and filter actions based on type or
          keywords.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <div className="flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search Actions by admin username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border w-full rounded-md py-3.5 px-5 outline-none border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600/50 dark:text-gray-300 transition-all duration-300"
          />
        </div>
        <div className="md:w-auto w-full relative">
          <button
            className="flex items-center justify-center gap-2 bg-white w-full dark:border-gray-600/50 border border-gray-200 dark:bg-gray-800 py-3.5 px-6 cursor-pointer rounded-md hover:shadow-lg transition-all duration-300 font-semibold"
            onClick={() => setCategory(!category)}
          >
            <span>Category</span>
            <ArrowDown size={20} strokeWidth={2.5} />
          </button>
          {category && (
            <div className="w-full absolute dark:bg-gray-800 border border-gray-200 dark:border-gray-600/50 flex flex-col px-5 py-2 mt-1 rounded-md z-10">
              <div className="flex gap-2 items-center mb-2 w-full justify-between">
                <label htmlFor="add">Add</label>
                <input
                  type="checkbox"
                  name="add"
                  id="add"
                  onChange={handleChange}
                  checked={inputCheck.add}
                />
              </div>
              <div className="flex gap-2 items-center mb-2 w-full justify-between">
                <label htmlFor="update">Update</label>
                <input
                  type="checkbox"
                  name="update"
                  id="update"
                  onChange={handleChange}
                  checked={inputCheck.update}
                />
              </div>
              <div className="flex gap-2 items-center mb-2 w-full justify-between">
                <label htmlFor="delete">Delete</label>
                <input
                  type="checkbox"
                  name="delete"
                  id="delete"
                  onChange={handleChange}
                  checked={inputCheck.delete}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid-cols-1 md:grid-cols-2 grid gap-5">
        {action.length === 0
          ? null
          : action.map((e, index) => (
              <div
                key={e.id}
                className="group relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute right-5 top-5">
                  <div
                    className={`
                      ${e.action === "Add" ? "bg-blue-500" : ""}
                      ${e.action === "Update" ? "bg-yellow-500" : ""}
                      ${e.action === "Delete" ? "bg-red-500" : ""}
                      flex items-center gap-2 py-2 px-4 rounded-lg shadow-md text-white font-semibold text-sm
                    `}
                  >
                    {getActionIcon(e.action)}
                    <span>{e.action}</span>
                  </div>
                </div>

                <div className="p-8 pt-20 flex flex-col h-full gap-3">
                  <div className="flex items-center gap-3 mb-4 absolute top-5 left-5">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl">
                    {e.explanation}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-600">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      <span>by {e.admin.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AllActions;
