"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const router = useRouter();
  const profileRef = useRef(null);

  // Load session
  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setSession(data.user || null);
    };
    fetchSession();
  }, []);

  // Load notifications
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

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    session?.name?.charAt(0).toUpperCase() ||
    session?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-10">
          <h1
            className="text-2xl font-extrabold text-amber-900 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            📚 Library
          </h1>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-6 text-amber-900 font-semibold">
            <button onClick={() => router.push("/home")} className="hover:text-amber-700">
              Home
            </button>
            <button onClick={() => router.push("/books")} className="hover:text-amber-700">
              Books
            </button>
            <button onClick={() => router.push("/peminjaman")} className="hover:text-amber-700">
              Peminjaman
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* NOTIFICATION */}
          <button
            onClick={() => router.push("/notifications")}
            className="hidden md:flex text-amber-900 text-2xl hover:text-amber-700 relative"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                {unread}
              </span>
            )}
          </button>

          {/* PROFILE */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold hover:opacity-90"
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-30">
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => router.push("/wishlist")}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-3xl text-amber-900"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-amber-50 border-t flex flex-col px-6 py-3 space-y-2">
          <button onClick={() => router.push("/home")} className="text-left font-medium">Home</button>
          <button onClick={() => router.push("/books")} className="text-left font-medium">Books</button>
          <button onClick={() => router.push("/borrowings")} className="text-left font-medium">Peminjaman</button>
          <button onClick={() => router.push("/wishlist")} className="text-left font-medium">Wishlist</button>

          <hr className="border-amber-200" />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-left text-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
