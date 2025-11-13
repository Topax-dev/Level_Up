"use client";

import { useParams } from "next/navigation";
import { showNotif } from "@/redux/notifSlice";
import { saveProgress } from "@/redux/progressSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const GetProgressById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const GetProgress = async () => {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/progress/${id}`
        );
        return dispatch(saveProgress(data.data[0].payload));
      } catch (error) {
        console.log(error);
        return dispatch(showNotif({ message: "Server Error", type: "error" }));
      }
    };
    GetProgress();
  }, [id, dispatch]);
};


export const formatHyphen = (name: string) => {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
};

export const formatNormal = (name: string) => {
  return name.trim().toLowerCase().replaceAll("-", " ");
};

export const GetParamsString = () => {
  const params = useParams();
  const title = params?.title as string;
  return formatNormal(title);
};

export const GetParamsNumber = (name: string) => {
  const params = useParams()
  const id = params[name]
  return id
}