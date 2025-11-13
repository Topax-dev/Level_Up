"use client";

import Homee from "@/components/Halaman Utama/home";
import "./globals.css";
import Feature from "@/components/Halaman Utama/feature";
import Curricullum from "@/components/Halaman Utama/curricullum";
import SupportUs from "@/components/Halaman Utama/support_us";
import Footer from "@/components/Halaman Utama/footer";
import NavbarDashboard from "@/components/dashboard/navbarDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";

export default function Aplikasi() {
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const avatarAdmin = useSelector((state: RootState) => state.admin.avatar)
  const [isAvatar, setIsAvatar] = useState('')
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if(avatarAdmin) return setIsAvatar(avatarAdmin)
      setIsAvatar(avatar)
  }, [isClient, avatar, avatarAdmin]);
  if (!isClient) return;
  return (
    <>
      <NavbarDashboard avatar={isAvatar} />
      <Homee />
      <Feature />
      <Curricullum />
      <SupportUs />
      <Footer />
    </>
  );
}
