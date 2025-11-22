"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";

export default function AdminKoleksiPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(true);

  const convertCategory = (cat) => {
    if (cat === 1 || cat === "1") return "Pemrograman";
    if (cat === 2 || cat === "2") return "Umum";
    if (cat === 3 || cat === "3") return "Novel";
    return "Tidak diketahui";
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        console.error("Gagal memuat data buku:", err);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-8">
      <AdminSidebar 
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">
        📚 Koleksi Buku Perpustakaan
      </h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center md:justify-between items-center mb-8">
        <input
          type="text"
          placeholder="🔍 Cari judul buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* 📕 List Buku */}
      {filteredBooks.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Tidak ada buku yang ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              {/* Cover */}
              <div className="flex items-center justify-center w-full h-56 bg-amber-100 text-6xl text-amber-700">
                📘
              </div>

              {/* Detail Buku */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {book.publisher} • {book.year}
                  </p>

                  {/* ⭐ Kategori */}
                  <p className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full font-medium">
                      {convertCategory(book.category)}
                    </span>
                  </p>
                </div>

                {/* Stok */}
                <div className="mt-4">
                  {book.stock > 0 ? (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full font-medium">
                      📗 Tersedia ({book.stock})
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full font-medium">
                      📕 Stok Habis
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
