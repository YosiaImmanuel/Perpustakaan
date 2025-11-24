"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar({ openSidebar, setOpenSidebar }) {
  const [session, setSession] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const router = useRouter();
  const profileRef = useRef(null);

  /* ===========================================================
     Load Session
     =========================================================== */
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setSession(data.user || null);
    };
    load();
  }, []);

  /* ===========================================================
     Load Notifikasi Belum Dibaca
     =========================================================== */
  useEffect(() => {
    if (!session) return;

    const loadNotif = async () => {
      const res = await fetch("/api/notifications", {
        headers: { "user-id": session.id },
      });

      const data = await res.json();
      const count = data.filter((n) => !n.is_read).length;
      setUnread(count);
    };

    loadNotif();
    const interval = setInterval(loadNotif, 5000);

    return () => clearInterval(interval);
  }, [session]);

  /* ===========================================================
     Close dropdown jika klik di luar
     =========================================================== */
  useEffect(() => {
    const outside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const initials =
    session?.name?.charAt(0).toUpperCase() ||
    session?.email?.charAt(0).toUpperCase() ||
    "U";

  /* ===========================================================
     RENDER
     =========================================================== */
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          {/* Button Sidebar - Mobile */}
          <button
            className="md:hidden text-3xl text-amber-900"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            ☰
          </button>

          {/* Logo */}
          <h1
            className="text-2xl font-extrabold text-amber-900 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            📚 Library
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* Notification */}
          <button
            onClick={() => router.push("/notifications")}
            className="text-3xl text-amber-900 relative"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                {unread}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold"
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-lg py-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
