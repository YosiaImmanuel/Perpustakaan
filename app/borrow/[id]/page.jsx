"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  HiUser, 
  HiMail, 
  HiLocationMarker, 
  HiCalendar,
  HiBookOpen,
  HiUserCircle,
  HiOfficeBuilding,
  HiCheckCircle,
  HiArrowLeft,
  HiExclamationCircle
} from "react-icons/hi";
import UserSidebar from "@/components/UserSidebar";

export default function BorrowBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔍 Ambil user dari session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        
        if (!data.user) {
          router.push("/login");
          return;
        }
        
        setUser(data.user);
      } catch (err) {
        console.error("Gagal ambil user:", err);
      }
    };
    fetchUser();
  }, [router]);

  // 🔍 Ambil detail buku berdasarkan ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error("Buku tidak ditemukan");
        }
        
        setBook(data);
      } catch (err) {
        console.error("Gagal ambil data buku:", err);
        alert("Buku tidak ditemukan");
        router.push("/books");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
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
        alert("✅ Pengajuan peminjaman berhasil dikirim!\nMenunggu persetujuan admin.");
        router.push("/peminjaman");
      } else {
        const error = await res.json();
        alert(`❌ Gagal mengajukan pinjaman: ${error.message || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan server. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⏳ Loading
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <UserSidebar />
        <div className="text-center lg:ml-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">

        {/* Form Container */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Page Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
              <HiBookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pengajuan Peminjaman Buku
            </h1>
            <p className="text-gray-600">
              Periksa data di bawah ini sebelum mengajukan peminjaman
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-0">

              {/* Left Side - User Data */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-amber-50 to-orange-50 border-r border-gray-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-white rounded-xl shadow-md">
                    <HiUserCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Data Peminjam
                  </h2>
                </div>

                <div className="space-y-4">
                  
                  {/* Name */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <HiUser className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Nama Lengkap</p>
                      <p className="text-gray-900 font-semibold">{user.name}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <HiMail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                      <p className="text-gray-900 font-semibold break-all">{user.email}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <HiLocationMarker className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Alamat</p>
                      <p className="text-gray-900 font-semibold">
                        {user.address || "Belum diisi"}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <HiCalendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Pengajuan</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date().toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <HiExclamationCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Informasi Penting:</p>
                    <p>Pastikan data Anda sudah benar. Pengajuan akan diproses oleh admin dalam 1-2 hari kerja.</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Book Data */}
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-amber-100 rounded-xl shadow-md">
                    <HiBookOpen className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Data Buku
                  </h2>
                </div>

                {/* Book Preview Card */}
                <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">📚</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600">Buku yang akan dipinjam</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  
                  {/* Author */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-white rounded-lg">
                      <HiUser className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Penulis</p>
                      <p className="text-gray-900 font-semibold">{book.author}</p>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-white rounded-lg">
                      <HiOfficeBuilding className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Penerbit</p>
                      <p className="text-gray-900 font-semibold">{book.publisher}</p>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-white rounded-lg">
                      <HiCalendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">Tahun Terbit</p>
                      <p className="text-gray-900 font-semibold">{book.year}</p>
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 hover:scale-105"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <HiCheckCircle className="w-6 h-6" />
                        Ajukan Peminjaman
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
                  >
                    <HiArrowLeft className="w-5 h-5" />
                    Kembali
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}