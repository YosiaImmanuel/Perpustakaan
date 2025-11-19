"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function BooksPage() {
  const [session, setSession] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlist, setWishlist] = useState([]);

  const [toast, setToast] = useState(null);
  const router = useRouter();

  const categories = ["all", "Pemrograman", "Umum"];

  // Load session + books + wishlist
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setSession(data.user);

      // Load books
      const bookRes = await fetch("/api/books");
      const booksData = await bookRes.json();
      setBooks(booksData);
      setFilteredBooks(booksData);

      // Load wishlist user dari DB
      const wlRes = await fetch("/api/wishlist", {
        headers: {
          "x-user-id": data.user.id,
        },
      });

      const wlData = await wlRes.json();
      setWishlist(wlData.map((b) => b.book_id));
    };

    loadData();
  }, [router]);

  // Filter kategori
  useEffect(() => {
    if (selectedCategory === "all") setFilteredBooks(books);
    else setFilteredBooks(books.filter((b) => b.category === selectedCategory));
  }, [selectedCategory, books]);

  // Auto close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Toggle wishlist database
  const toggleWishlist = async (bookId) => {
    const already = wishlist.includes(bookId);

    if (already) {
      // Hapus
      await fetch("/api/wishlist", {
        method: "DELETE",
        body: JSON.stringify({
          userId: session.id,
          bookId,
        }),
      });

      setWishlist((prev) => prev.filter((id) => id !== bookId));
    } else {
      // Tambah
      await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({
          userId: session.id,
          bookId,
        }),
      });

      setWishlist((prev) => [...prev, bookId]);
      setToast("✨ Berhasil ditambahkan ke Wishlist!");
    }
  };

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <p className="text-gray-600 text-lg font-medium">Memuat halaman...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-[999]">
          {toast}
        </div>
      )}

      <Navbar session={session} />

      {/* Header */}
      <div className="px-6 md:px-20 pt-10 pb-4">
        <h1 className="text-3xl font-extrabold text-amber-900">📚 Koleksi Buku</h1>
        <p className="text-amber-800">Temukan buku sesuai kategori.</p>
      </div>

      {/* Filter */}
      <div className="px-6 md:px-20 mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-amber-200 rounded-lg shadow-sm bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Semua Kategori" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Buku */}
      <div className="px-6 md:px-20 pb-10">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-600">Tidak ada buku ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const isWishlisted = wishlist.includes(book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
                >
                  {/* Wishlist icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(book.id);
                    }}
                    className="absolute top-3 right-3 text-pink-500 text-2xl hover:scale-110 transition"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-pink-500 drop-shadow-md" />
                    ) : (
                      <FaRegHeart className="text-gray-400 group-hover:text-pink-400 transition" />
                    )}
                  </button>

                  {/* Thumbnail */}
                  <div className="flex items-center justify-center w-full h-56 bg-amber-100 text-6xl text-amber-700">
                    📘
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <p className="text-xs text-gray-500">
                        {book.publisher} • {book.year}
                      </p>

                      <p className="mt-2 text-xs text-amber-700 bg-amber-100 inline-block px-2 py-1 rounded-md font-medium">
                        🏷 {book.category}
                      </p>
                    </div>

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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/books/${book.id}`);
                      }}
                      className={`mt-4 w-full px-4 py-2 rounded-lg font-medium text-white shadow-md transition ${
                        book.stock > 0
                          ? "bg-amber-700 hover:bg-amber-800"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {book.stock > 0 ? "📚 Pinjam Buku" : "Tidak Tersedia"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
