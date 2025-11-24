"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Home,
  BookOpen,
  ClipboardList,
  Heart,
  Bell,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut
} from "lucide-react";

export default function UserSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [session, setSession] = useState(null);
  const [unread, setUnread] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef(null);

  const menu = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Books", path: "/books", icon: BookOpen },
    { name: "Peminjaman", path: "/peminjaman", icon: ClipboardList },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
  ];

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

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 h-screen
          bg-gray-900 border-r border-gray-800 shadow-2xl z-50
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64" : "w-16"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
              aria-label={isExpanded ? "Tutup sidebar" : "Buka sidebar"}
            >
              {isExpanded ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {isExpanded && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-semibold text-white">Library</span>
              </div>
            )}
          </div>

          {/* MENU NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menu.map((item) => {
              const active = pathname === item.path;
              const IconComponent = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center w-full p-3 rounded-lg
                    transition-all duration-200
                    ${!isExpanded && "justify-center"}
                    ${
                      active
                        ? "bg-amber-600 text-white shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                  title={!isExpanded ? item.name : ""}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </button>
              );
            })}

            {/* Notifikasi */}
            <button
              onClick={() => router.push("/notifications")}
              className={`
                flex items-center w-full p-3 rounded-lg
                text-gray-400 hover:bg-gray-800 hover:text-white
                transition-all duration-200 relative
                ${!isExpanded && "justify-center"}
                ${pathname === "/notifications" ? "bg-amber-600 text-white shadow-lg" : ""}
              `}
              title={!isExpanded ? "Notifikasi" : ""}
            >
              <div className="relative flex-shrink-0">
                <Bell className="w-5 h-5" />
                {/* Badge notifikasi untuk collapsed */}
                {unread > 0 && !isExpanded && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>
              {isExpanded && (
                <div className="ml-3 flex items-center justify-between w-full">
                  <span className="font-medium">Notifikasi</span>
                  {unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                      {unread}
                    </span>
                  )}
                </div>
              )}
            </button>
          </nav>

          {/* BOTTOM SECTION - Profile */}
          <div className="border-t border-gray-800 p-3">
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  if (!isExpanded) {
                    setIsExpanded(true);
                  } else {
                    setProfileOpen(!profileOpen);
                  }
                }}
                className={`
                  flex items-center w-full p-3 rounded-lg
                  text-gray-400 hover:bg-gray-800 hover:text-white
                  transition-all duration-200
                  ${!isExpanded && "justify-center"}
                `}
                title={!isExpanded ? "Profile" : ""}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                  {/* Green status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                
                {isExpanded && session && (
                  <div className="ml-3 text-left flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {session.name || session.email}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                        {session.role || "User"}
                      </span>
                    </div>
                  </div>
                )}
                {isExpanded && (
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && isExpanded && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 shadow-xl rounded-lg py-1 mx-3">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      if (confirm("Yakin mau logout?")) {
                        signOut({ callbackUrl: "/" });
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY untuk mobile ketika sidebar expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
    </>
  );
}