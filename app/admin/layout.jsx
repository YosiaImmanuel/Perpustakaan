"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <AdminSidebar 
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {/* TOMBOL OPEN SIDEBAR MOBILE */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-amber-700 text-white px-3 py-2 rounded"
        onClick={() => setOpenSidebar(true)}
      >
        ☰
      </button>

      {/* CONTENT */}
      <main className="flex-1 p-6 ml-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
