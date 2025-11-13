"use client";

import { IUserSlice } from "@/interface/iAll";
import { clearAdminData, saveAdminData } from "@/redux/adminSlice";
import { hideLoading, showLoading } from "@/redux/loadingSlice";
import { showNotif } from "@/redux/notifSlice";
import { AppDispatch } from "@/redux/store";
import { clearUserData, saveUserData } from "@/redux/userSlice";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useCekAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    dispatch(showLoading());

    const cekAuth = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify/auth`,
          {},
          { withCredentials: true }
        );

        const userId = res.data?.payload?.id ?? res.data[0]?.payload?.id;
        if (!userId) throw new Error("User ID not found");

        const res2 = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}`
        );

        const user: IUserSlice = res2.data?.payload ?? res2.data[0]?.payload;
        if (!user) throw new Error("User data not found");

        if (isMounted) {
          dispatch(saveUserData(user));
          setAuthorized(true);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (isMounted) {
          setAuthorized(false);
          dispatch(clearUserData());
        }

        if (err.response?.status === 401) {
          dispatch(showNotif({ message: "Not Logged In Yet", type: "error" }));
        } else if (err.response?.status === 403) {
          dispatch(showNotif({ message: "Invalid Credential", type: "error" }));
        } else {
          console.error("Auth Error:", err.message);
        }
        router.push("/sign_in");
      } finally {
        dispatch(hideLoading());
        if (isMounted) setLoading(false);
      }
    };

    cekAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router]);

  return { loading, authorized };
};

export const useCekLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Router = useRouter();
  useEffect(() => {
    const cekAuth = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify/auth`,
          {},
          { withCredentials: true, validateStatus: () => true }
        );
        if (response.status === 200) {
          dispatch(showNotif({ message: "You`are Logged In", type: "info" }));
          return Router.push("/dashboard");
        }
      } catch (error) {
        console.error("User Belum Login", error);
      }
    };
    cekAuth();
  }, [Router, dispatch]);
};

export const useCekAuthAdminAndOwner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    const getAdminData = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify/auth/admin`,
          {},
          { withCredentials: true }
        );
        const adminId = res.data[0].payload.id;
        if (!adminId) throw new Error("Who Fuck Is You");
        const res2 = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/${adminId}`
        );
        const adminData = res2.data[0].payload;
        return dispatch(saveAdminData(adminData));
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        dispatch(clearAdminData());

        if (err.response?.status === 401) {
          dispatch(showNotif({ message: "Not Logged In Yet", type: "error" }));
        } else if (err.response?.status === 403) {
          dispatch(showNotif({ message: "Invalid Credential", type: "error" }));
        } else {
          console.error("Auth Error:", err.message);
        }
        router.push("/admin/sign_in");
      }
    };

    getAdminData();
  }, [dispatch, router]);
};

export const useCekLoginAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Router = useRouter();
  useEffect(() => {
    const cekLoginAdmin = async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify/auth/admin`,
        {},
        { withCredentials: true, validateStatus: () => true }
      );
      if (response.status === 200) {
        dispatch(showNotif({ message: "You Are Logged In", type: "info" }));
        return Router.push("/dashboard/admin");
      }
    };
    cekLoginAdmin();
  }, [dispatch, Router]);
};

export const useCekCredentialsAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Router = useRouter();
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const CekLoginAdmin = async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify/auth/admin`,
        {},
        { withCredentials: true, validateStatus: () => true }
      );
      if (response.status === 401 || response.status === 403) {
        dispatch(
          showNotif({ message: "You Are Not Logged In Yet", type: "info" })
        );
        setAuthorized(false);
        Router.push("/admin/sign_in");
      }
    };
    CekLoginAdmin();
  }, [dispatch, Router]);

  return { authorized };
};
