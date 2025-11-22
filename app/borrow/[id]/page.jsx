"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BorrowBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  // 🔍 Ambil user dari session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Gagal ambil user:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔍 Ambil detail buku berdasarkan ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Gagal ambil data buku:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
          status: "pending",
        }),
      });

      if (res.ok) {
        alert("✅ Pengajuan peminjaman dikirim. Menunggu persetujuan admin.");
        router.push("/peminjaman");
      } else {
        alert("❌ Gagal mengajukan pinjaman.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    }
  };

  // ⏳ Loading
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-10 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">

        <div className="grid md:grid-cols-2">

          {/* 👤 Data Peminjam */}
          <div className="p-8 border-r border-amber-100 bg-amber-50">
            <h2 className="text-2xl font-bold text-amber-900 mb-5 flex items-center gap-2">
              👤 Data Peminjam
            </h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Nama:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Alamat:</strong> <span className="block">{user.address || "-"}</span></p>
              <p><strong>Tanggal Pengajuan:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            <div className="mt-6 p-4 bg-amber-100 text-amber-800 rounded-lg text-sm">
              Pastikan data benar sebelum mengajukan peminjaman.
            </div>
          </div>

          {/* 📘 Data Buku */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-5 flex items-center gap-2">
              📘 Data Buku
            </h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Judul:</strong> {book.title}</p>
              <p><strong>Penulis:</strong> {book.author}</p>
              <p><strong>Penerbit:</strong> {book.publisher}</p>
              <p><strong>Tahun:</strong> {book.year}</p>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
            >
              Ajukan Pinjaman
            </button>

            <button
              onClick={() => router.push("/")}
              className="mt-3 w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Kembali ke Home
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
