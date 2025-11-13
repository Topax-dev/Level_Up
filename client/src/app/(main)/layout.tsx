"use client";

import NavbarDashboard from "@/components/dashboard/navbarDashboard";
import Footer from "@/components/Halaman Utama/footer";
import SupportUs from "@/components/Halaman Utama/support_us";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const avatar = useSelector((state: RootState) => state.user.avatar);
  const avatarAdmin = useSelector((state: RootState) => state.admin.avatar);
  const [isAvatar, setIsAvatar] = useState('')
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if(avatarAdmin) return setIsAvatar(avatarAdmin)
      setIsAvatar(avatar)
  }, [isClient, avatar, avatarAdmin, setIsAvatar]);
  if (!isClient) return null;
  return (
    <div className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
      <NavbarDashboard avatar={isAvatar} />
      <hr className="dark:border-gray-800 border-gray-200" />
      {children}
      <SupportUs />
      <Footer />
    </div>
  );
}
