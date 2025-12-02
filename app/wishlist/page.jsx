"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiHeart, HiBookOpen } from "react-icons/hi";
import UserSidebar from "@/components/UserSidebar";

export default function WishlistPage() {
  const [books, setBooks] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  const categoryNames = {
    1: "Pemrograman",
    2: "Umum",
    3: "Novel",
  };

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetch("/api/session");
        const sess = await s.json();
        
        if (!sess.user) {
          router.push("/login");
          return;
        }
        
        setSession(sess.user);

        const res = await fetch("/api/wishlist", {
          headers: { "x-user-id": sess.user.id },
        });

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  // Auto close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const pinjamBuku = (bookId) => {
    router.push(`/borrow/${bookId}`);
  };

  const removeWishlist = async (bookId, e) => {
    e.stopPropagation();

    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.id,
        },
        body: JSON.stringify({
          userId: session.id,
          bookId: bookId,
        }),
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
        setToast("💔 Dihapus dari Wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Gagal menghapus dari wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <UserSidebar />
        <div className="text-center lg:ml-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Memuat wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-xl z-[999] animate-slide-in-right flex items-center gap-2">
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <HiHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Wishlist Anda</h1>
                <p className="text-gray-700 font-medium">Koleksi buku yang Anda simpan</p>
              </div>
            </div>

            {/* Counter */}
            {books.length > 0 && (
              <div className="mt-4 text-base text-gray-800 font-medium">
                Menampilkan <span className="font-bold text-gray-900">{books.length}</span> buku
              </div>
            )}
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {books.length === 0 ? (
            <div className="text-center py-20">
              <HiHeart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-800 font-bold">Wishlist Anda masih kosong</p>
              <p className="text-gray-600 font-medium mt-2">Mulai tambahkan buku favorit ke wishlist Anda</p>
              <button
                onClick={() => router.push("/books")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md"
              >
                Jelajahi Buku
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.book_id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border-2 border-gray-100 hover:border-amber-300"
                >
                  {/* Card Header - Thumbnail */}
                  <div 
                    onClick={() => router.push(`/books/${book.book_id}`)}
                    className="relative h-64 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => removeWishlist(book.book_id, e)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                    >
                      <HiHeart className="text-pink-500 w-5 h-5" />
                    </button>

                    {/* Book Icon */}
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <HiBookOpen className="w-24 h-24 text-amber-400" />
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3">
                      {book.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 text-xs rounded-full font-bold shadow-md border-2 border-green-600">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Tersedia ({book.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 text-xs rounded-full font-bold shadow-md border-2 border-red-600">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          Stok Habis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div 
                    onClick={() => router.push(`/books/${book.book_id}`)}
                    className="p-5 flex flex-col flex-1"
                  >
                    {/* Category Badge */}
                    <span className="inline-block w-fit px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-bold mb-3 border border-amber-200">
                      {categoryNames[book.category] || "Lainnya"}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-sm text-gray-700 font-medium mb-1">oleh {book.author}</p>

                    {/* Publisher & Year */}
                    <p className="text-xs text-gray-600 font-medium mb-4">
                      {book.publisher} • {book.year}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (book.stock > 0) {
                          pinjamBuku(book.book_id);
                        }
                      }}
                      disabled={book.stock === 0}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        book.stock > 0
                          ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      <HiBookOpen className="w-5 h-5" />
                      {book.stock > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}