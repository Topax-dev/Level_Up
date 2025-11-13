"use client";

import { hideNotif } from "@/redux/notifSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Notif = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id, show, message, type } = useSelector(
    (state: RootState) => state.notif
  );

  useEffect(() => {
    if (show) {
      const setTimer = setTimeout(() => {
        dispatch(hideNotif());
      }, 3000);

      return () => clearTimeout(setTimer);
    }
  }, [show, id, dispatch]);

  const handleClose = () => {
    dispatch(hideNotif());
  };

  if (!show) return null;

  const getIconAndStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
          bgColor: "bg-green-50 dark:bg-green-900/40",
          borderColor: "border-green-200 dark:border-green-800",
          iconColor: "text-green-600 dark:text-green-400",
          textColor: "text-green-800 dark:text-green-200",
          closeColor: "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
          bgColor: "bg-red-50 dark:bg-red-900/40",
          borderColor: "border-red-200 dark:border-red-800",
          iconColor: "text-red-600 dark:text-red-400",
          textColor: "text-red-800 dark:text-red-200",
          closeColor: "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
        };
      default:
        return {
          icon: <Info className="w-5 h-5 flex-shrink-0" />,
          bgColor: "bg-blue-50 dark:bg-blue-900/40",
          borderColor: "border-blue-200 dark:border-blue-800",
          iconColor: "text-blue-600 dark:text-blue-400",
          textColor: "text-blue-800 dark:text-blue-200",
          closeColor: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        };
    }
  };

  const styles = getIconAndStyles();

  return (
    <div className="fixed z-50 top-4 right-4 left-4 sm:left-auto sm:w-96 animate-slideIn">
      <div
        className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3 p-4">
          <div className={styles.iconColor}>
            {styles.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`${styles.textColor} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className={`${styles.closeColor} transition-colors flex-shrink-0 ml-2`}
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            } animate-progress`}
          />
        </div>
      </div>
    </div>
  );
};

export default Notif;