"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/borrows?userId=1", {
          signal: controller.signal,
        });

        const data = await res.json();

        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") setError("Gagal memuat riwayat.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    return () => controller.abort();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Navbar />

      {/* HEADER */}
      <div className="px-6 md:px-16 pt-10 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 flex gap-2 items-center">
          📚 Riwayat Peminjaman
        </h1>
        <p className="text-amber-800">Semua aktivitas peminjamanmu tercatat di sini.</p>
      </div>

      {/* CONTENT */}
      <div className="px-6 md:px-16 pb-10 space-y-4">
        {loading && <p className="text-center text-gray-600">Memuat...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && history.length === 0 && !error && (
          <p className="text-center text-gray-600 mt-10">
            Belum ada riwayat peminjaman.
          </p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-amber-200 shadow-sm hover:shadow-md transition rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {/* LEFT SECTION */}
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                {item.book || "Judul tidak tersedia"}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                📅 <span className="font-medium">Dipinjam:</span>{" "}
                {formatDate(item.borrow_date)}
              </p>

              <p className="text-sm text-gray-600">
                🕒 <span className="font-medium">Batas Kembali:</span>{" "}
                {item.return_date ? formatDate(item.return_date) : "Belum ditentukan"}
              </p>
            </div>

            {/* STATUS */}
            <div className="mt-4 md:mt-0">
              {item.status === "pending" && (
                <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  ⏳ Menunggu
                </span>
              )}

              {item.status === "approved" && (
                <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  ✅ Disetujui
                </span>
              )}

              {item.status === "rejected" && (
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                  ❌ Ditolak
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
