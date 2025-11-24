"use client";

import { useState, useEffect } from "react";
import {
  HiBookOpen,
  HiPencil,
  HiTrash,
  HiPlus,
  HiX,
  HiCheck,
  HiSearch,
} from "react-icons/hi";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    stock: 0,
    category: "1",
  });

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      setBooks(await res.json());
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || String(book.category) === selectedCategory;
    return matchSearch && matchCategory;
  });

  // ===================== ADD/EDIT BOOK =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      alert("✅ Buku berhasil diperbarui!");
    } else {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("✅ Buku berhasil ditambahkan!");
    }

    resetForm();
    fetchBooks();
  };

  // ===================== START EDIT =====================
  const handleStartEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      stock: book.stock,
      category: String(book.category),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===================== DELETE =====================
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBooks();
    alert("✅ Buku berhasil dihapus!");
  };

  // ===================== RESET FORM =====================
  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      author: "",
      publisher: "",
      year: "",
      stock: 0,
      category: "1",
    });
  };

  const convertCategory = (cat) => {
    if (cat === 1) return "Pemrograman";
    if (cat === 2) return "Umum";
    if (cat === 3) return "Novel";
    return "Lainnya";
  };

  const getCategoryColor = (cat) => {
    if (cat === 1) return "bg-blue-100 text-blue-800";
    if (cat === 2) return "bg-purple-100 text-purple-800";
    if (cat === 3) return "bg-pink-100 text-pink-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <HiBookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kelola Buku</h1>
              <p className="text-gray-600">Tambah, edit, dan hapus buku perpustakaan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              {editingId ? (
                <HiPencil className="w-5 h-5 text-amber-600" />
              ) : (
                <HiPlus className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Buku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul buku"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penulis
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama penulis"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerbit
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama penerbit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={form.publisher}
                  onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  placeholder="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="1">Pemrograman</option>
                  <option value="2">Umum</option>
                  <option value="3">Novel</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-md transition-all"
              >
                {editingId ? (
                  <>
                    <HiCheck className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                ) : (
                  <>
                    <HiPlus className="w-5 h-5" />
                    Tambah Buku
                  </>
                )}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
                >
                  <HiX className="w-5 h-5" />
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:w-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="1">Pemrograman</option>
              <option value="2">Umum</option>
              <option value="3">Novel</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredBooks.length}</span> dari{" "}
            <span className="font-semibold text-gray-900">{books.length}</span> buku
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Penulis
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Penerbit
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <HiBookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Tidak ada buku ditemukan</p>
                        <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{book.author || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{book.publisher || "-"}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{book.year || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            book.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(book.category)}`}>
                          {convertCategory(book.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(book)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <HiPencil className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(book.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <HiTrash className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}