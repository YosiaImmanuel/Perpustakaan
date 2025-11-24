"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT - No padding here, let children handle their own spacing */}
      <main className="lg:ml-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}