"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DetailBook() {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const bookId = params?.id;

  // 🔍 Ambil detail buku
  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!bookId) return;
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Gagal mengambil data buku");
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat data buku...
      </div>
    );
  }

  // ❌ Buku tidak ditemukan
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Buku tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-10 px-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md flex flex-col md:flex-row overflow-hidden border border-amber-100">

        {/* 📘 Ikon Buku */}
        <div className="flex-1 bg-amber-50 flex flex-col items-center justify-center p-8 text-amber-700">
          <div className="text-8xl mb-3">📚</div>
          <p className="text-sm font-medium text-gray-600">Buku Perpustakaan</p>
        </div>

        {/* 📖 Detail Buku */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-3">{book.title}</h1>

          <p className="text-gray-700 mb-1"><strong>Penulis:</strong> {book.author || "-"}</p>

          <p className="text-gray-700 mb-1">
            <strong>Kategori:</strong>{" "}
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-sm font-medium">
              {book.category || "Umum"}
            </span>
          </p>

          <p className="text-gray-700 mb-1"><strong>Penerbit:</strong> {book.publisher || "-"}</p>
          <p className="text-gray-700 mb-3"><strong>Tahun:</strong> {book.year || "-"}</p>

          {/* Stok */}
          {book.stock > 0 ? (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {book.stock} buku tersedia
            </span>
          ) : (
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Stok habis
            </span>
          )}

          {/* Deskripsi */}
          <div className="mt-2">
            <h2 className="font-semibold text-amber-900 mb-1">Deskripsi Buku</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {book.description ||
                "Buku ini belum memiliki deskripsi khusus dari perpustakaan."}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 mt-6">

            {/* 🔙 Kembali ke Home */}
            <Link
              href="/home"
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              ← Kembali
            </Link>

            {/* 📘 Pinjam Buku */}
            <Link
              href={`/borrow/${book.id}`}
              className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition ${
                book.stock > 0
                  ? "bg-amber-700 hover:bg-amber-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Pinjam Buku
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
