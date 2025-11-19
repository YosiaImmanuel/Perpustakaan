import pool from "./db";

// 📚 Ambil semua buku
export async function getBooks() {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
    return rows;
  } catch (err) {
    console.error("❌ Gagal mengambil daftar buku:", err);
    throw new Error("Gagal mengambil daftar buku");
  }
}

// 📖 Ambil satu buku berdasarkan ID
export async function getBook(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Gagal mengambil buku:", err);
    throw new Error("Gagal mengambil buku");
  }
}

// ➕ Tambah buku baru (dengan kategori)
export async function addBook({ title, author, publisher, year, stock, category }) {
  try {
    const allowedCategories = ["Pemrograman", "Umum"];

    if (!allowedCategories.includes(category)) {
      throw new Error("Kategori tidak valid. Hanya boleh: Pemrograman, Umum");
    }

    const [result] = await pool.query(
      `INSERT INTO books (title, author, publisher, year, stock, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, publisher, year, stock, category]
    );

    return {
      id: result.insertId,
      title,
      author,
      publisher,
      year,
      stock,
      category,
    };
  } catch (err) {
    console.error("❌ Gagal menambah buku:", err);
    throw new Error("Gagal menambah buku");
  }
}

// 🗑 Hapus buku berdasarkan ID
export async function deleteBook(id) {
  try {
    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw new Error("Buku tidak ditemukan");
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Gagal menghapus buku:", err);
    throw new Error("Gagal menghapus buku");
  }
}
