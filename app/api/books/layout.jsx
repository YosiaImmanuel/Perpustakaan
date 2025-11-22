"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-amber-50">

      {/* Sidebar Component */}
      <AdminSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      {/* Wrapper */}
      <div className="flex-1 ml-0 md:ml-64">

        {/* Top Navbar (Mobile Only) */}
        <div className="md:hidden bg-white px-4 py-3 shadow-sm flex items-center justify-between border-b border-amber-200">
          <h2 className="text-xl font-bold text-amber-800">Admin Panel</h2>

          {/* Logout + Sidebar Toggle */}
          <div className="flex items-center gap-4">
            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 font-semibold border border-red-600 px-3 py-1 rounded-lg"
            >
              Logout
            </button>

            {/* Sidebar Toggle */}
            <button
              className="text-3xl text-amber-800"
              onClick={() => setOpenSidebar(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
