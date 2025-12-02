"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  HiViewGrid,
  HiBookOpen,
  HiCollection,
  HiClipboardList,
  HiMenu,
  HiX,
  HiChevronDown,
  HiCog,
  HiLogout
} from "react-icons/hi";

export default function AdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const profileRef = useRef(null);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HiViewGrid },
    { name: "Kelola Buku", path: "/admin/books", icon: HiBookOpen },
    { 
      name: "Riwayat Peminjaman", 
      path: "/admin/history", 
      icon: HiClipboardList,
      badge: pendingCount
    },
  ];

  /* ===========================================================
     Fetch jumlah peminjaman pending
     =========================================================== */
  const fetchPendingCount = async () => {
    try {
      const res = await fetch("/api/borrows");
      if (res.ok) {
        const data = await res.json();
        const borrows = Array.isArray(data) ? data : [];
        const pending = borrows.filter(b => b.status === "pending").length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error("Error fetching pending count:", err);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    
    // Poll setiap 30 detik untuk update real-time
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh count ketika route berubah (misal setelah approve/reject)
  useEffect(() => {
    if (pathname === "/admin/history") {
      fetchPendingCount();
    }
  }, [pathname]);

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
    session?.user?.name?.charAt(0).toUpperCase() ||
    session?.user?.email?.charAt(0).toUpperCase() ||
    "A";

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
                <HiX className="w-5 h-5" />
              ) : (
                <HiMenu className="w-5 h-5" />
              )}
            </button>
            
            {isExpanded && (
              <div className="flex items-center gap-2">
                <HiViewGrid className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-semibold text-white">Admin</span>
              </div>
            )}
          </div>

          {/* MENU NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menu.map((item) => {
              const active = pathname.startsWith(item.path);
              const IconComponent = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center w-full p-3 rounded-lg
                    transition-all duration-200 relative
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
                  
                  {/* Badge Counter */}
                  {item.badge > 0 && (
                    <span 
                      className={`
                        flex items-center justify-center
                        min-w-[20px] h-5 px-1.5
                        bg-red-500 text-white text-xs font-bold rounded-full
                        ${isExpanded ? 'ml-auto' : 'absolute -top-1 -right-1'}
                        animate-pulse
                      `}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
                
                {isExpanded && session?.user && (
                  <div className="ml-3 text-left flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {session.user.name || session.user.email}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block px-2 py-0.5 bg-amber-600 text-white text-xs font-semibold rounded">
                        Admin
                      </span>
                    </div>
                  </div>
                )}
                {isExpanded && (
                  <HiChevronDown 
                    className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && isExpanded && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 shadow-xl rounded-lg py-1 mx-3">
                  <button
                    onClick={() => {
                      router.push("/admin/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <HiCog className="w-4 h-4" />
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
                    <HiLogout className="w-4 h-4" />
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