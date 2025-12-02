"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiClipboardList,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiCalendar,
  HiUser,
  HiBookOpen,
  HiFilter,
} from "react-icons/hi";

export default function AdminHistory() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/borrows");
      const data = await res.json();
      setBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
    
    // Auto refresh setiap 30 detik untuk cek peminjaman baru
    const interval = setInterval(fetchBorrows, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatus = async (borrowId, status) => {
    const confirmMsg = status === "approved" 
      ? "Apakah Anda yakin ingin menyetujui peminjaman ini?" 
      : "Apakah Anda yakin ingin menolak peminjaman ini?";
    
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/borrows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId, status }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err?.error || "Gagal memperbarui status");
        return;
      }

      alert(status === "approved" ? "✅ Peminjaman berhasil disetujui" : "❌ Peminjaman ditolak");
      
      // Refresh data
      await fetchBorrows();
      
      // Trigger refresh pada sidebar dengan router refresh
      router.refresh();
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredBorrows = filter === "all" 
    ? borrows 
    : borrows.filter(b => b.status === filter);

  const statusCounts = {
    all: borrows.length,
    pending: borrows.filter(b => b.status === "pending").length,
    approved: borrows.filter(b => b.status === "approved").length,
    returned: borrows.filter(b => b.status === "returned").length,
    rejected: borrows.filter(b => b.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <HiClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Riwayat Peminjaman</h1>
              <p className="text-gray-600">Kelola semua permintaan peminjaman buku</p>
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

      {/* Content */}
      <div className="px-6 py-8">
        
        {/* Stats Alert for Pending */}
        {statusCounts.pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
            <HiClock className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">
                {statusCounts.pending} permintaan menunggu persetujuan
              </p>
              <p className="text-sm text-yellow-700">
                Segera tinjau dan proses permintaan peminjaman
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBorrows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <HiClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-600 mb-2">
              {filter === "all" 
                ? "Belum ada peminjaman" 
                : `Tidak ada peminjaman dengan status "${filter}"`}
            </p>
            <p className="text-gray-500">
              Data akan muncul di sini ketika ada permintaan peminjaman
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBorrows.map((borrow) => {
              const statusConfig = getStatusConfig(borrow.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={borrow.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      
                      {/* Left - Borrow Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Book Icon */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                            <HiBookOpen className="w-8 h-8 text-amber-600" />
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {borrow.book || "Judul tidak tersedia"}
                            </h3>

                            <div className="space-y-1">
                              {/* Student Name */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <HiUser className="w-4 h-4 text-amber-600" />
                                <span className="font-medium">Peminjam:</span>
                                <span>{borrow.student || "-"}</span>
                              </div>

                              {/* Borrow Date */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <HiCalendar className="w-4 h-4 text-amber-600" />
                                <span className="font-medium">Tanggal Pinjam:</span>
                                <span>{formatDate(borrow.borrow_date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} font-semibold`}>
                          <StatusIcon className="w-5 h-5" />
                          {statusConfig.text}
                        </div>

                        {/* Action Buttons for Pending */}
                        {borrow.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatus(borrow.id, "approved")}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                              <HiCheckCircle className="w-4 h-4" />
                              Setujui
                            </button>
                            <button
                              onClick={() => handleStatus(borrow.id, "rejected")}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                              <HiXCircle className="w-4 h-4" />
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {filteredBorrows.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 text-center">
            Menampilkan <span className="font-semibold text-gray-900">{filteredBorrows.length}</span> dari{" "}
            <span className="font-semibold text-gray-900">{borrows.length}</span> peminjaman
          </div>
        )}
      </div>
    </div>
  );
}