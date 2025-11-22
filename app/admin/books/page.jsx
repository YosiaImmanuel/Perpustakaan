"use client";

import { useState, useEffect } from "react";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null); // ⭐ ID yg sedang di-edit

  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    stock: 0,
    category: "1",
  });

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    setBooks(await res.json());
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ===================== ADD BOOK =====================
  const handleAdd = async (e) => {
    e.preventDefault();

    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

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
  };

  // ===================== SAVE EDIT =====================
  const handleEdit = async (e) => {
    e.preventDefault();

    await fetch("/api/books", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...form,
      }),
    });

    resetForm();
    fetchBooks();
  };

  // ===================== DELETE =====================
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus buku ini?")) return;

    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBooks();
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
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📘 Kelola Buku</h1>

      {/* ===================== FORM TAMBAH / EDIT ==================== */}
      <form
        onSubmit={editingId ? handleEdit : handleAdd}
        className="grid md:grid-cols-2 gap-3 mb-6"
      >
        <input
          placeholder="Judul Buku"
          className="border p-2 rounded"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Penulis"
          className="border p-2 rounded"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <input
          placeholder="Penerbit"
          className="border p-2 rounded"
          value={form.publisher}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
        />

        <input
          type="number"
          placeholder="Tahun"
          className="border p-2 rounded"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        <input
          type="number"
          placeholder="Stok"
          className="border p-2 rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="1">Pemrograman</option>
          <option value="2">Umum</option>
          <option value="3">Novel</option>
        </select>

        <div className="flex gap-2 col-span-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            {editingId ? "💾 Simpan Perubahan" : "➕ Tambah Buku"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
            >
              ❌ Batal
            </button>
          )}
        </div>
      </form>

      {/* ===================== TABLE LIST ==================== */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Judul</th>
              <th className="border p-2">Penulis</th>
              <th className="border p-2">Penerbit</th>
              <th className="border p-2">Tahun</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">{book.publisher}</td>
                <td className="border p-2 text-center">{book.year}</td>
                <td className="border p-2 text-center">{book.stock}</td>

                <td className="border p-2 text-center">
                  {convertCategory(book.category)}
                </td>

                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleStartEdit(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
