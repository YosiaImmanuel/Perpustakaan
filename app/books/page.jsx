"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart, FaSearch, FaFilter } from "react-icons/fa";
import { HiBookOpen } from "react-icons/hi";
import UserSidebar from "@/components/UserSidebar";

export default function BooksPage() {
  const [session, setSession] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  /* ===========================================================
     🔖 Mapping kategori (DB → UI)
     =========================================================== */
  const categoryMap = {
    1: "Pemrograman",
    2: "Umum",
    3: "Novel",
  };

  /* ===========================================================
     📂 Daftar kategori untuk filter
     =========================================================== */
  const categories = ["all", "Pemrograman", "Umum", "Novel"];

  /* ===========================================================
     🔄 Load session + books + wishlist
     =========================================================== */
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setSession(data.user);

      // Ambil buku
      const bookRes = await fetch("/api/books");
      const booksData = await bookRes.json();

      const mappedBooks = booksData.map((b) => ({
        ...b,
        category: categoryMap[b.category] || "Lainnya",
      }));

      setBooks(mappedBooks);
      setFilteredBooks(mappedBooks);

      // Ambil wishlist user
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

  /* ===========================================================
     🎯 Filter kategori & search
     =========================================================== */
  useEffect(() => {
    let result = books;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(result);
  }, [selectedCategory, searchQuery, books]);

  /* ===========================================================
     ⏳ Auto close toast
     =========================================================== */
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* ===========================================================
     💗 Wishlist toggle
     =========================================================== */
  const toggleWishlist = async (bookId) => {
    const already = wishlist.includes(bookId);

    if (already) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        body: JSON.stringify({
          userId: session.id,
          bookId,
        }),
      });

      setWishlist((prev) => prev.filter((id) => id !== bookId));
      setToast("💔 Dihapus dari Wishlist");
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({
          userId: session.id,
          bookId,
        }),
      });

      setWishlist((prev) => [...prev, bookId]);
      setToast("💝 Ditambahkan ke Wishlist!");
    }
  };

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-xl z-[999] animate-slide-in-right flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <HiBookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Koleksi Buku</h1>
                <p className="text-gray-600">Temukan buku favorit Anda</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white shadow-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="relative md:w-64">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer bg-white shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Semua Kategori" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-900">{filteredBooks.length}</span> buku
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-600 font-medium">Tidak ada buku ditemukan</p>
              <p className="text-gray-500 mt-2">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => {
                const isWishlisted = wishlist.includes(book.id);

                return (
                  <div
                    key={book.id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border border-gray-100 hover:border-amber-200"
                  >
                    {/* Card Header - Thumbnail */}
                    <div 
                      onClick={() => router.push(`/books/${book.id}`)}
                      className="relative h-64 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(book.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                      >
                        {isWishlisted ? (
                          <FaHeart className="text-pink-500 w-5 h-5" />
                        ) : (
                          <FaRegHeart className="text-gray-400 group-hover:text-pink-400 w-5 h-5 transition" />
                        )}
                      </button>

                      {/* Book Icon */}
                      <div className="text-8xl text-amber-400 group-hover:scale-110 transition-transform duration-300">
                        📘
                      </div>

                      {/* Stock Badge */}
                      <div className="absolute bottom-3 left-3">
                        {book.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 text-xs rounded-full font-medium shadow-md">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Tersedia ({book.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 text-xs rounded-full font-medium shadow-md">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            Stok Habis
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div 
                      onClick={() => router.push(`/books/${book.id}`)}
                      className="p-5 flex flex-col flex-1"
                    >
                      {/* Category Badge */}
                      <span className="inline-block w-fit px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-semibold mb-3">
                        {book.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                        {book.title}
                      </h3>

                      {/* Author */}
                      <p className="text-sm text-gray-600 mb-1">oleh {book.author}</p>

                      {/* Publisher & Year */}
                      <p className="text-xs text-gray-500 mb-4">
                        {book.publisher} • {book.year}
                      </p>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (book.stock > 0) {
                            router.push(`/books/${book.id}`);
                          }
                        }}
                        disabled={book.stock === 0}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          book.stock > 0
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <HiBookOpen className="w-5 h-5" />
                        {book.stock > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}