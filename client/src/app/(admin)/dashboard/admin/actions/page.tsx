"use client";

import { IActionAdmin } from "@/interface/iAll";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { NotepadText, Clock, Plus, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ActionAdmin = () => {
  const adminId = useSelector((state: RootState) => state.admin.id);
  const dispatch = useDispatch<AppDispatch>();
  const [action, setAction] = useState<IActionAdmin[]>([]);
  
  useEffect(() => {
    const getAction = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/action-admin/${adminId}`
        );
        console.log(response);
        setAction(response.data[0].payload);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };
    getAction();
  }, [dispatch, adminId]);

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
    <div className="min-h-screen py-12 xl:px-55 lg:px-40 md:px-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Your Actions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track and review all administrative actions you ve performed in the system
          </p>
        </div>

        {action.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
              <NotepadText size={64} strokeWidth={1.5} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-300 mb-3">
              No Actions Found
            </h2>
            <p className="text-gray-500 dark:text-gray-500 text-center max-w-md">
              You haven t performed any administrative actions yet. Your activity log will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {action.map((e, index) => (
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
                      <span>Administrative Action</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionAdmin;