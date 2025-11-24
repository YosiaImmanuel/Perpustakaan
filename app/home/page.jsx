"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import {
  HiViewGrid,
  HiBookOpen,
  HiClipboardList,
  HiHeart,
  HiClock,
  HiCheckCircle,
  HiTrendingUp,
  HiRefresh,
} from "react-icons/hi";

export default function HomePage() {
  const [session, setSession] = useState(undefined);
  const [stats, setStats] = useState({
    totalBooks: 0,
    myBorrows: 0,
    myWishlist: 0,
    pendingBorrows: 0,
  });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get session
        const sessionRes = await fetch("/api/session");
        const sessionData = await sessionRes.json();

        if (!sessionData.user) {
          router.push("/login");
          return;
        }

        setSession(sessionData.user);

        // Fetch all data in parallel
        const [booksRes, borrowsRes, wishlistRes] = await Promise.all([
          fetch("/api/books"),
          fetch(`/api/borrows?userId=${sessionData.user.id}`),
          fetch("/api/wishlist", {
            headers: { "x-user-id": sessionData.user.id },
          }),
        ]);

        const books = await booksRes.json();
        const borrows = await borrowsRes.json();
        const wishlist = await wishlistRes.json();

        // Calculate stats
        setStats({
          totalBooks: books.length,
          myBorrows: borrows.length,
          myWishlist: Array.isArray(wishlist) ? wishlist.length : 0,
          pendingBorrows: borrows.filter((b) => b.status === "pending").length,
        });

        // Get recent borrows (last 3)
        setRecentBorrows(borrows.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Menunggu" },
      approved: { color: "bg-green-100 text-green-800", text: "Disetujui" },
      returned: { color: "bg-blue-100 text-blue-800", text: "Dikembalikan" },
      rejected: { color: "bg-red-100 text-red-800", text: "Ditolak" },
    };
    return configs[status] || configs.pending;
  };

  if (loading || session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <UserSidebar />
        <div className="text-center lg:ml-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UserSidebar />

      {/* Main Content */}
      <main className="lg:ml-16 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <HiViewGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Selamat Datang, {session.name || "User"}!
                  </h1>
                  <p className="text-gray-600">Dashboard perpustakaan Anda</p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <HiRefresh className="w-5 h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Total Books */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                  <HiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>Available</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBooks}</h3>
              <p className="text-gray-600 text-sm font-medium">Total Buku Tersedia</p>
            </div>

            {/* My Borrows */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                  <HiClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>All Time</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.myBorrows}</h3>
              <p className="text-gray-600 text-sm font-medium">Peminjaman Saya</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-md">
                  <HiClock className="w-6 h-6 text-white" />
                </div>
                {stats.pendingBorrows > 0 && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingBorrows}</h3>
              <p className="text-gray-600 text-sm font-medium">Menunggu Persetujuan</p>
            </div>

            {/* Wishlist */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-md">
                  <HiHeart className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-pink-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>Saved</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.myWishlist}</h3>
              <p className="text-gray-600 text-sm font-medium">Buku di Wishlist</p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <button
                onClick={() => router.push("/books")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all group"
              >
                <HiBookOpen className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Jelajahi Buku</p>
                  <p className="text-xs text-gray-600">Cari buku favorit</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/peminjaman")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl transition-all group"
              >
                <HiClipboardList className="w-6 h-6 text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Peminjaman</p>
                  <p className="text-xs text-gray-600">Lihat riwayat</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/wishlist")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 rounded-xl transition-all group"
              >
                <HiHeart className="w-6 h-6 text-pink-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">Wishlist</p>
                  <p className="text-xs text-gray-600">{stats.myWishlist} buku tersimpan</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/notifications")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all group"
              >
                <HiCheckCircle className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Notifikasi</p>
                  <p className="text-xs text-gray-600">Lihat notifikasi</p>
                </div>
              </button>

            </div>
          </div>

          {/* Recent Borrows */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <HiClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Peminjaman Terbaru</h2>
                  <p className="text-sm text-gray-600">3 peminjaman terakhir Anda</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/peminjaman")}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                Lihat Semua
              </button>
            </div>

            {recentBorrows.length === 0 ? (
              <div className="text-center py-12">
                <HiClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Belum ada peminjaman</p>
                <p className="text-sm text-gray-500 mt-1">Mulai pinjam buku untuk melihat riwayat di sini</p>
                <button
                  onClick={() => router.push("/books")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Jelajahi Buku
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBorrows.map((borrow) => {
                  const statusConfig = getStatusConfig(borrow.status);
                  return (
                    <div
                      key={borrow.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <HiBookOpen className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {borrow.book || "Buku"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(borrow.borrow_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}