"use client";
import { useEffect, useState } from "react";

export default function AdminHistory() {
  const [borrows, setBorrows] = useState([]);

  const fetchBorrows = async () => {
    const res = await fetch("/api/borrows");
    setBorrows(await res.json());
  };

  const handleStatus = async (borrowId, status) => {
    const res = await fetch("/api/borrows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrowId, status }),
    });

    if (res.ok) {
      alert(status === "approved"
        ? "✅ Peminjaman disetujui (ingatkan 10 hari pengembalian)"
        : "❌ Peminjaman ditolak");
      fetchBorrows();
    } else {
      alert("Gagal memperbarui status");
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📜 Riwayat Peminjaman</h1>

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
                  <td className="border p-2 text-center">{b.borrow_date?.slice(0, 10)}</td>
                  <td className="border p-2 text-center capitalize">{b.status}</td>
                  <td className="border p-2 text-center">
                    {b.status === "pending" && (
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
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
