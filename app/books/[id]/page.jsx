"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  HiArrowLeft, 
  HiBookOpen, 
  HiUser, 
  HiTag, 
  HiOfficeBuilding, 
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiHeart,
  HiOutlineHeart
} from "react-icons/hi";
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
          <p className="text-gray-600 text-lg font-medium">Memuat data buku...</p>
        </div>
      </div>
    );
  }

  // ❌ Buku tidak ditemukan
  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <UserSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-xl z-[999] animate-slide-in-right">
          {toast}
        </div>
      )}

      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">


        {/* Book Detail Container */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-5 gap-0">
              
              {/* Left Side - Book Cover */}
              <div className="md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 p-12 flex flex-col items-center justify-center relative">
                
                {/* Wishlist Button */}
                {session && (
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    {isWishlisted ? (
                      <HiHeart className="w-6 h-6 text-pink-500" />
                    ) : (
                      <HiOutlineHeart className="w-6 h-6 text-gray-400 hover:text-pink-400" />
                    )}
                  </button>
                )}

                {/* Book Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-3xl opacity-30"></div>
                  <div className="relative text-9xl mb-6">📚</div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Buku Perpustakaan
                  </p>
                  
                  {/* Stock Badge - Prominent */}
                  <div className="mt-6">
                    {book.stock > 0 ? (
                      <div className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                        <HiCheckCircle className="w-6 h-6" />
                        <span>Tersedia ({book.stock})</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                        <HiXCircle className="w-6 h-6" />
                        <span>Stok Habis</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Book Details */}
              <div className="md:col-span-3 p-10">
                
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-semibold text-sm mb-4">
                  <HiTag className="w-4 h-4" />
                  {book.category}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {book.title}
                </h1>

                {/* Book Info Cards */}
                <div className="space-y-4 mb-8">
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <HiUser className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Penulis</p>
                      <p className="text-gray-900 font-semibold">{book.author || "-"}</p>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <HiOfficeBuilding className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Penerbit</p>
                      <p className="text-gray-900 font-semibold">{book.publisher || "-"}</p>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <HiCalendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Tahun Terbit</p>
                      <p className="text-gray-900 font-semibold">{book.year || "-"}</p>
                    </div>
                  </div>

                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 mb-8">
                  <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <HiBookOpen className="w-5 h-5 text-amber-600" />
                    Deskripsi Buku
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description ||
                      "Buku ini belum memiliki deskripsi khusus dari perpustakaan. Silakan hubungi pustakawan untuk informasi lebih lanjut tentang buku ini."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.back()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all"
                  >
                    <HiArrowLeft className="w-5 h-5" />
                    Kembali
                  </button>

                  <Link
                    href={book.stock > 0 ? `/borrow/${book.id}` : "#"}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold shadow-lg transition-all ${
                      book.stock > 0
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (book.stock === 0) e.preventDefault();
                    }}
                  >
                    <HiBookOpen className="w-5 h-5" />
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