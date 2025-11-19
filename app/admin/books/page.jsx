"use client";
import { useState, useEffect } from "react";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    stock: 0,
  });

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    setBooks(await res.json());
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", author: "", publisher: "", year: "", stock: 0 });
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus buku ini?")) return;
    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBooks();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📘 Kelola Buku</h1>

      <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-3 mb-6">
        <input placeholder="Judul Buku" className="border p-2 rounded" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/>
        <input placeholder="Penulis" className="border p-2 rounded" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}/>
        <input placeholder="Penerbit" className="border p-2 rounded" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })}/>
        <input type="number" placeholder="Tahun" className="border p-2 rounded" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}/>
        <input type="number" placeholder="Stok" className="border p-2 rounded" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}/>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-2">Tambah Buku</button>
      </form>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Judul</th>
              <th className="border p-2">Penulis</th>
              <th className="border p-2">Penerbit</th>
              <th className="border p-2">Tahun</th>
              <th className="border p-2">Stok</th>
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
                  <button onClick={() => handleDelete(book.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
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
