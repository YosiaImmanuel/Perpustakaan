import pool from "./db";

/* ============================================================
   📚 1. GET ALL BOOKS
   ============================================================ */
export async function getBooks() {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, author, publisher, year, stock, category
       FROM books
       ORDER BY id DESC`
    );
    return rows;
  } catch (err) {
    console.error("❌ Error getBooks:", err);
    throw new Error("Gagal mengambil daftar buku");
  }
}

/* ============================================================
   📖 2. GET BOOK BY ID
   ============================================================ */
export async function getBook(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("❌ Error getBook:", err);
    throw new Error("Gagal mengambil data buku");
  }
}

/* ============================================================
   ➕ 3. ADD NEW BOOK
   ============================================================ */
export async function addBook({ title, author, publisher, year, stock, category }) {
  try {
    if (!title || !author || !publisher) {
      throw new Error("Title, Author, Publisher wajib diisi");
    }

    // Biarkan year & stock bisa bernilai 0 tanpa error
    year = parseInt(year) || 0;
    stock = parseInt(stock) || 0;
    category = parseInt(category) || 1;

    const allowedCategories = [1, 2, 3];
    if (!allowedCategories.includes(category)) {
      throw new Error("Kategori tidak valid. (1=Pemrograman, 2=Umum, 3=Novel)");
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
      category
    };

  } catch (err) {
    console.error("❌ Error addBook:", err);
    throw new Error(err.message || "Gagal menambah buku");
  }
}

/* ============================================================
   ✏ 4. UPDATE BOOK  
   FORMAT YANG DIPAKAI API:
   updateBook(id, { title, author, ... })
   ============================================================ */
/* ============================================================
   ✏ 4. UPDATE BOOK (versi aman)
   ============================================================ */
export async function updateBook(id, data = {}) {
  try {
    if (!id) throw new Error("ID buku wajib ada");
    if (!data || typeof data !== "object") {
      throw new Error("Data update tidak valid");
    }

    const allowedFields = ["title", "author", "publisher", "year", "stock", "category"];
    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      if (data[key] !== undefined && data[key] !== null) {
        let value = data[key];

        // Convert number fields
        if (key === "year" || key === "stock" || key === "category") {
          value = parseInt(value);
          if (isNaN(value)) continue; // skip kalau kosong / invalid
        }

        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    // Jika tidak ada field untuk update → error
    if (fields.length === 0) {
      throw new Error("Tidak ada field yang diperbarui");
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE books SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error("Buku tidak ditemukan");
    }

    return { success: true };

  } catch (err) {
    console.error("❌ Error updateBook:", err);
    throw new Error(err.message || "Gagal memperbarui buku");
  }
}


/* ============================================================
   🗑 5. DELETE BOOK
   ============================================================ */
export async function deleteBook(id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM books WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Buku tidak ditemukan");
    }

    return { success: true };

  } catch (err) {
    console.error("❌ Error deleteBook:", err);
    throw new Error(err.message || "Gagal menghapus buku");
  }
}
