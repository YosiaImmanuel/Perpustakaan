"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import { useRouter } from "next/navigation";
import { 
  HiClock, 
  HiCalendar, 
  HiCheckCircle, 
  HiXCircle,
  HiRefresh,
  HiClipboardList,
  HiBookOpen,
  HiExclamation
} from "react-icons/hi";

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [returningId, setReturningId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const sres = await fetch("/api/session");
        const sdata = await sres.json();
        const u = sdata?.user;

        if (!u) {
          router.push("/login");
          return;
        }

        if (mounted) setUserId(u.id);

        const res = await fetch(`/api/borrows?userId=${u.id}`);
        const data = await res.json();

        if (mounted) setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Gagal memuat riwayat.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [router]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d)
      ? "-"
      : d.toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const handleReturn = async (borrowId) => {
    if (!confirm("Yakin ingin mengembalikan buku ini?")) return;

    setReturningId(borrowId);

    try {
      const res = await fetch("/api/borrows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId, status: "returned" }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err?.error || "Gagal mengembalikan buku");
        return;
      }

      const refreshed = await fetch(`/api/borrows?userId=${userId}`);
      const data = await refreshed.json();
      setHistory(Array.isArray(data) ? data : []);

      alert("✅ Buku berhasil dikembalikan");
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan");
    } finally {
      setReturningId(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: HiClock,
        text: "Menunggu",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
      },
      approved: {
        icon: HiCheckCircle,
        text: "Disetujui",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      },
      returned: {
        icon: HiBookOpen,
        text: "Dikembalikan",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
      },
      rejected: {
        icon: HiXCircle,
        text: "Ditolak",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(item => item.status === filter);

  const statusCounts = {
    all: history.length,
    pending: history.filter(h => h.status === "pending").length,
    approved: history.filter(h => h.status === "approved").length,
    returned: history.filter(h => h.status === "returned").length,
    rejected: history.filter(h => h.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <HiClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Riwayat Peminjaman
                </h1>
                <p className="text-gray-600 mt-1">
                  Semua aktivitas peminjaman Anda tercatat di sini
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { value: "all", label: "Semua", count: statusCounts.all },
                { value: "pending", label: "Menunggu", count: statusCounts.pending },
                { value: "approved", label: "Disetujui", count: statusCounts.approved },
                { value: "returned", label: "Dikembalikan", count: statusCounts.returned },
                { value: "rejected", label: "Ditolak", count: statusCounts.rejected },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filter === tab.value
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      filter === tab.value 
                        ? "bg-white text-amber-600" 
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Memuat riwayat...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <HiXCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredHistory.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-600 font-medium mb-2">
                {filter === "all" 
                  ? "Belum ada riwayat peminjaman" 
                  : `Tidak ada peminjaman dengan status "${filter}"`}
              </p>
              <p className="text-gray-500">
                Mulai pinjam buku untuk melihat riwayat di sini
              </p>
              <button
                onClick={() => router.push("/books")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Jelajahi Buku
              </button>
            </div>
          )}

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      
                      {/* Left Side - Book Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Book Icon */}
                          <div className=" w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl">
                            <HiBookOpen className="w-10 h-10 text-amber-400" />
                          </div>

                          {/* Book Details */}
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                              {item.book || "Judul tidak tersedia"}
                            </h2>

                            <div className="space-y-2">
                              {/* Borrow Date */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <HiCalendar className="w-4 h-4 text-amber-600" />
                                <span className="font-medium">Dipinjam:</span>
                                <span>{formatDate(item.borrow_date)}</span>
                              </div>

                              {/* Return Date */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <HiClock className="w-4 h-4 text-amber-600" />
                                <span className="font-medium">Batas Kembali:</span>
                                <span>
                                  {item.return_date 
                                    ? formatDate(item.return_date) 
                                    : "Belum ditentukan"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} font-semibold`}>
                          <StatusIcon className="w-5 h-5" />
                          {statusConfig.text}
                        </div>

                        {/* Return Button for Approved Items */}
                        {item.status === "approved" && (
                          <button
                            onClick={() => handleReturn(item.id)}
                            disabled={returningId === item.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                              returningId === item.id
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg"
                            }`}
                          >
                            {returningId === item.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Memproses...
                              </>
                            ) : (
                              <>
                                <HiRefresh className="w-4 h-4" />
                                Kembalikan Buku
                              </>
                            )}
                          </button>
                        )}

                        {/* Warning for Overdue */}
                        {item.status === "approved" && item.return_date && 
                         new Date(item.return_date) < new Date() && (
                          <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                            <HiExclamation className="w-3 h-3" />
                            Terlambat!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}