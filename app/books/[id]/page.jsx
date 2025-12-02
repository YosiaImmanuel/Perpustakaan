"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Tag, 
  Building2, 
  Calendar,
  CheckCircle,
  XCircle,
  Heart,
} from "lucide-react";
import UserSidebar from "@/components/UserSidebar";

export default function DetailBook() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState(null);

  const bookId = params?.id;

  // 🏷 Mapping kategori angka → teks
  const categoryMap = {
    1: "Pemrograman",
    2: "Umum",
    3: "Novel",
  };

  // 🔍 Load session
  useEffect(() => {
    const loadSession = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setSession(data.user || null);
    };
    loadSession();
  }, []);

  // 🔍 Ambil detail buku
  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!bookId) return;

        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Gagal mengambil data buku");

        // 🟢 Convert kategori angka → teks
        const mapped = {
          ...data,
          category: categoryMap[data.category] || "Tidak diketahui",
        };

        setBook(mapped);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlist = async () => {
      if (!session || !bookId) return;

      const res = await fetch("/api/wishlist", {
        headers: { "x-user-id": session.id },
      });
      const data = await res.json();
      setIsWishlisted(data.some((item) => item.book_id === parseInt(bookId)));
    };

    checkWishlist();
  }, [session, bookId]);

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (!session) return;

    if (isWishlisted) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        body: JSON.stringify({ userId: session.id, bookId }),
      });
      setIsWishlisted(false);
      setToast("💔 Dihapus dari Wishlist");
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ userId: session.id, bookId }),
      });
      setIsWishlisted(true);
      setToast("💝 Ditambahkan ke Wishlist!");
    }
  };

  // Auto close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <UserSidebar />
        <div className="text-center lg:ml-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Memuat data buku...</p>
        </div>
      </div>
    );
  }

  // ❌ Buku tidak ditemukan
  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <UserSidebar />
        <div className="text-center lg:ml-16">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-800 font-bold">Buku tidak ditemukan</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Kembali
          </button>
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

      {/* Main Content - Centered */}
      <div className="lg:ml-16 min-h-screen flex items-center justify-center py-8 px-4">
        
        {/* Book Detail Container */}
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
            <div className="grid md:grid-cols-5 gap-0">
              
              {/* Left Side - Book Cover */}
              <div className="md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[400px] md:min-h-[600px]">
                
                {/* Wishlist Button */}
                {session && (
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-5 h-5 md:w-6 md:h-6 ${isWishlisted ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`}
                    />
                  </button>
                )}

                {/* Book Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-3xl opacity-30"></div>
                  <div className="relative">
                    <BookOpen className="w-32 h-32 md:w-40 md:h-40 text-amber-500 mx-auto" />
                  </div>
                </div>
                
                <div className="text-center mt-4 md:mt-6">
                  <p className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Buku Perpustakaan
                  </p>
                  
                  {/* Stock Badge - Prominent */}
                  <div className="mt-4 md:mt-6">
                    {book.stock > 0 ? (
                      <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold shadow-lg border-2 border-green-600">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-sm md:text-base">Tersedia ({book.stock})</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold shadow-lg border-2 border-red-600">
                        <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-sm md:text-base">Stok Habis</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Book Details */}
              <div className="md:col-span-3 p-6 md:p-10">
                
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-amber-100 text-amber-800 rounded-full font-bold text-xs md:text-sm mb-3 md:mb-4 border border-amber-200">
                  <Tag className="w-3 h-3 md:w-4 md:h-4" />
                  {book.category}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {book.title}
                </h1>

                {/* Book Info Cards */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  
                  {/* Author */}
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="p-2 md:p-3 bg-white rounded-lg shadow-sm">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">Penulis</p>
                      <p className="text-sm md:text-base text-gray-900 font-bold">{book.author || "-"}</p>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="p-2 md:p-3 bg-white rounded-lg shadow-sm">
                      <Building2 className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">Penerbit</p>
                      <p className="text-sm md:text-base text-gray-900 font-bold">{book.publisher || "-"}</p>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="p-2 md:p-3 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">Tahun Terbit</p>
                      <p className="text-sm md:text-base text-gray-900 font-bold">{book.year || "-"}</p>
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button
                    onClick={() => router.back()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-bold transition-all text-sm md:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    Kembali
                  </button>

                  <Link
                    href={book.stock > 0 ? `/borrow/${book.id}` : "#"}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold shadow-lg transition-all text-sm md:text-base ${
                      book.stock > 0
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white hover:scale-105"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (book.stock === 0) e.preventDefault();
                    }}
                  >
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                    {book.stock > 0 ? "Pinjam Buku" : "Tidak Tersedia"}
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}