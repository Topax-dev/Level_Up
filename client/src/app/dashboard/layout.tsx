"use client";

import SupportUs from "@/components/Halaman Utama/support_us";
import Footer from "@/components/Halaman Utama/footer";
import NavbarDashboard from "@/components/dashboard/navbarDashboard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useCekAuth } from "@/utils/cekAuth";
import { useEffect, useState } from "react";
import { startRender } from "@/redux/notRenderSlice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { authorized } = useCekAuth();
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const avatar = useSelector((state: RootState) => state.user.avatar);
  useEffect(() => {
    setIsClient(true);
    dispatch(startRender());
  }, [dispatch]);
  if (!authorized) return null
  if (!isClient) return null;
  return (
    <div className="bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300 min-h-screen flex flex-col transition-colors duration-300">
      <NavbarDashboard avatar={avatar} />
      <hr className="dark:border-gray-800 border-gray-200" />
      <main className="flex-grow">{children}</main>
      <SupportUs />
      <Footer />
    </div>
  );
}
