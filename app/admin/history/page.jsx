"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";

export default function AdminHistory() {
  const [openSidebar, setOpenSidebar] = useState(false); // <<< WAJIB
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const handleStatus = async (borrowId, status) => {
    if (status === "approved" && !confirm("Setujui peminjaman ini?")) return;
    if (status === "rejected" && !confirm("Tolak peminjaman ini?")) return;

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

      alert(status === "approved" ? "✅ Peminjaman disetujui" : "❌ Peminjaman ditolak");
      fetchBorrows();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar 
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="flex-1 p-6">
        {/* Tombol buka sidebar hanya di mobile */}
        <button
          onClick={() => setOpenSidebar(true)}
          className="md:hidden bg-amber-600 text-white px-3 py-2 rounded mb-4"
        >
          ☰ Menu
        </button>

        <h1 className="text-2xl font-bold mb-4">📜 Riwayat Peminjaman (Admin)</h1>

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Nama Peminjam</th>
                  <th className="border p-2">Judul Buku</th>
                  <th className="border p-2">Tanggal Pinjam</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {borrows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 p-4">
                      Belum ada peminjaman.
                    </td>
                  </tr>
                ) : (
                  borrows.map((b) => (
                    <tr key={b.id}>
                      <td className="border p-2">{b.student}</td>
                      <td className="border p-2">{b.book}</td>
                      <td className="border p-2 text-center">
                        {b.borrow_date ? b.borrow_date.slice(0, 10) : "-"}
                      </td>
                      <td className="border p-2 text-center capitalize">{b.status}</td>
                      <td className="border p-2 text-center">
                        {b.status === "pending" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleStatus(b.id, "approved")}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleStatus(b.id, "rejected")}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">{b.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
