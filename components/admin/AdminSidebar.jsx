"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminSidebar({ openSidebar, setOpenSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Kelola Buku", path: "/admin/books", icon: "📚" },
    { name: "Koleksi Buku", path: "/admin/koleksi", icon: "📘" },
    { name: "Riwayat Peminjaman", path: "/admin/history", icon: "📜" },
  ];

  const handleLogout = async () => {
    if (!confirm("Yakin mau logout?")) return;

    setIsLoggingOut(true);

    setTimeout(async () => {
      await signOut({ redirect: false });
      router.push("/");
    }, 300);
  };

  return (
    <>
      {/* ==== Sidebar ==== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-amber-200 p-5 w-64 z-50 transform transition-transform duration-300
        ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <h2
          className="text-2xl font-extrabold text-amber-800 mb-6 cursor-pointer"
          onClick={() => router.push("/admin/dashboard")}
        >
          📚 Admin Panel
        </h2>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setOpenSidebar(false); // <— aman sekarang
                }}
                className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition
                  ${
                    active
                      ? "bg-amber-700 text-white shadow-md"
                      : "text-amber-800 hover:bg-amber-100"
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span> {item.name}
              </button>
            );
          })}

          {/* ==== Logout Button ==== */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium transition mt-8
              text-red-700 hover:bg-red-100
              active:scale-95
              relative overflow-hidden
              ${isLoggingOut ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <span className="absolute inset-0 bg-red-200 opacity-0 hover:opacity-20 transition-opacity"></span>
            <span className="mr-3 text-lg">🚪</span>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </aside>

      {/* Overlay Mobile */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
    </>
  );
}
