"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function UserHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // akan diisi dari /api/session

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // ambil session
        const sres = await fetch("/api/session");
        const sdata = await sres.json();
        const u = sdata?.user;
        if (!u) {
          if (mounted) {
            setError("Tidak terautentikasi.");
            setLoading(false);
          }
          return;
        }
        if (mounted) setUserId(u.id);

        // ambil history user
        const res = await fetch(`/api/borrows?userId=${u.id}`);
        const data = await res.json();
        if (mounted) {
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Gagal memuat riwayat.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
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

  const handleReturn = async (borrowId) => {
    if (!confirm("Yakin ingin mengembalikan buku ini?")) return;
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

      // refresh list
      const refreshed = await fetch(`/api/borrows?userId=${userId}`);
      const data = await refreshed.json();
      setHistory(Array.isArray(data) ? data : []);
      alert("Buku berhasil dikembalikan");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Navbar />

      <div className="px-6 md:px-16 pt-10 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 flex gap-2 items-center">
          📚 Riwayat Peminjaman
        </h1>
        <p className="text-amber-800">Semua aktivitas peminjamanmu tercatat di sini.</p>
      </div>

      <div className="px-6 md:px-16 pb-10 space-y-4">
        {loading && <p className="text-center text-gray-600">Memuat...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && history.length === 0 && !error && (
          <p className="text-center text-gray-600 mt-10">Belum ada riwayat peminjaman.</p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-amber-200 shadow-sm hover:shadow-md transition rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-amber-900">{item.book || "Judul tidak tersedia"}</h2>

              <p className="text-sm text-gray-600 mt-1">
                📅 <span className="font-medium">Dipinjam:</span> {formatDate(item.borrow_date)}
              </p>

              <p className="text-sm text-gray-600">
                🕒 <span className="font-medium">Batas Kembali:</span>{" "}
                {item.return_date ? formatDate(item.return_date) : "Belum ditentukan"}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-end">
              {item.status === "pending" && (
                <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">⏳ Menunggu</span>
              )}

              {item.status === "approved" && (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">✅ Disetujui</span>

                  <button
                    onClick={() => handleReturn(item.id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-lg"
                  >
                    Kembalikan Buku
                  </button>
                </>
              )}

              {item.status === "returned" && (
                <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">📘 Dikembalikan</span>
              )}

              {item.status === "rejected" && (
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-medium">❌ Ditolak</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
