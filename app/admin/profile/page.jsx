"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Mail,
  MapPin,
  Shield,
  Edit,
  Check,
  X,
  LogOut,
  BookOpen,
  ClipboardList,
  Clock,
} from "lucide-react";

export default function AdminProfilePage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrows: 0,
    pending: 0,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get session
        const res = await fetch("/api/session");
        const data = await res.json();

        if (!data.user || data.user.role !== "admin") {
          router.push("/login");
          return;
        }

        setSession(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          address: data.user.address || "",
        });

        // Get admin stats
        const [booksRes, borrowsRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/borrows"),
        ]);

        const books = await booksRes.json();
        const borrows = await borrowsRes.json();

        setStats({
          totalBooks: Array.isArray(books) ? books.length : 0,
          totalBorrows: Array.isArray(borrows) ? borrows.length : 0,
          pending: Array.isArray(borrows) 
            ? borrows.filter((b) => b.status === "pending").length 
            : 0,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.id,
          name: formData.name,
          address: formData.address,
        }),
      });

      if (res.ok) {
        setSession({ ...session, name: formData.name, address: formData.address });
        setIsEditing(false);
        alert("Profile berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: session.name || "",
      email: session.email || "",
      address: session.address || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      signOut({ callbackUrl: "/" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat profile...</p>
        </div>
      </div>
    );
  }

  const initials =
    session?.name?.charAt(0).toUpperCase() ||
    session?.email?.charAt(0).toUpperCase() ||
    "A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Admin</h1>
              <p className="text-gray-600">Kelola informasi akun administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                {/* Avatar */}
                <div className="mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                    {initials}
                  </div>
                </div>

                {/* Name & Email */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {session?.name || "Admin"}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{session?.email}</p>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm mb-6">
                  <Shield className="w-4 h-4" />
                  Administrator
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Total Buku</span>
                    </div>
                    <span className="font-bold text-gray-900">{stats.totalBooks}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-amber-600" />
                      <span className="text-sm text-gray-600">Total Peminjaman</span>
                    </div>
                    <span className="font-bold text-gray-900">{stats.totalBorrows}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">Menunggu Approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{stats.pending}</span>
                      {stats.pending > 0 && (
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </div>

            {/* Right Column - Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Informasi Profile</h2>
                  
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 text-amber-600" />
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">
                          {session?.name || "-"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Email Field (Read Only) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 text-amber-600" />
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-600">{session?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Email tidak dapat diubah
                      </p>
                    </div>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Alamat
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        placeholder="Masukkan alamat lengkap"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900">
                          {session?.address || "Alamat belum diisi"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for Edit Mode */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                          isSaving
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Simpan Perubahan
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
                      >
                        <X className="w-5 h-5" />
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Informasi Akun Administrator
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Status Akun:</span>{" "}
                    <span className="text-green-600 font-semibold">Aktif</span>
                  </p>
                  <p>
                    <span className="font-medium">Level Akses:</span>{" "}
                    <span className="text-amber-600 font-semibold">Full Access</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}