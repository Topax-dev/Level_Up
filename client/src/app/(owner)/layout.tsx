"use client";

import SupportUs from "@/components/Halaman Utama/support_us";
import Footer from "@/components/Halaman Utama/footer";
import NavbarDashboard from "@/components/dashboard/navbarDashboard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useCekAuthAdminAndOwner } from "@/utils/cekAuth";
import { useEffect, useState } from "react";
import { startRender } from "@/redux/notRenderSlice";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useCekAuthAdminAndOwner();
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const admin = useSelector((state: RootState) => state.admin);
  useEffect(() => {
    if(!admin.id) return
    setIsClient(true)
    dispatch(startRender())
    if(admin.role !== 'owner') {
      router.push('/')
    }
  }, [dispatch, admin.id, admin.role, router])
  if(!isClient) return null;
  if(!admin.id) return null
  if(admin.role !== 'owner') return null
  return (
    <div className="bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300 min-h-screen flex flex-col transition-colors duration-300">
      <NavbarDashboard avatar={admin.avatar} />
      <hr className="dark:border-gray-800 border-gray-200" />
      <main className="flex-grow">{children}</main>
      <SupportUs />
      <Footer />
    </div>
  );
}
