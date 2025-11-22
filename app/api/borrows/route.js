import pool from "@/lib/db";

/**
 * GET  → Admin: semua borrows, User: berdasarkan userId
 * POST → Student ajukan pinjaman
 * PATCH → Admin approve/reject, User/Admin return
 */

// ============================
// GET — Ambil data
// ============================
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Jika userId ada → tampilkan riwayat milik user tersebut
    if (userId) {
      const [rows] = await pool.query(
        `
        SELECT 
          b.id,
          b.user_id,
          u.name AS student,
          bk.title AS book,
          b.borrow_date,
          b.return_date,
          b.status
        FROM borrows b
        JOIN users u ON b.user_id = u.id
        JOIN books bk ON b.book_id = bk.id
        WHERE b.user_id = ?
        ORDER BY b.id DESC
      `,
        [userId]
      );

      return Response.json(rows, { status: 200 });
    }

    // Admin → semua data
    const [rows] = await pool.query(`
      SELECT 
        b.id,
        b.user_id,
        u.name AS student,
        bk.title AS book,
        b.borrow_date,
        b.return_date,
        b.status
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      ORDER BY b.id DESC
    `);

    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /borrows error:", error);
    return Response.json(
      { error: "Gagal mengambil data peminjaman" },
      { status: 500 }
    );
  }
}

// ============================
// POST — Student ajukan peminjaman
// ============================
export async function POST(req) {
  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return Response.json(
        { error: "userId dan bookId wajib diisi" },
        { status: 400 }
      );
    }

    // cek buku & stok
    const [[book]] = await pool.query(
      "SELECT stock, title FROM books WHERE id = ?",
      [bookId]
    );

    if (!book)
      return Response.json({ error: "Buku tidak ditemukan" }, { status: 404 });

    if (book.stock <= 0)
      return Response.json({ error: "Stok habis" }, { status: 400 });

    // Insert pending
    await pool.query(
      `INSERT INTO borrows (user_id, book_id, borrow_date, status) 
       VALUES (?, ?, ?, ?)`,
      [userId, bookId, new Date(), "pending"]
    );

    return Response.json(
      { message: "Pengajuan peminjaman berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /borrows error:", error);
    return Response.json(
      { error: "Gagal mengajukan peminjaman" },
      { status: 500 }
    );
  }
}

// ============================
// PATCH — Approve | Reject | Return
// ============================
export async function PATCH(req) {
  try {
    const { borrowId, status } = await req.json();

    if (!borrowId || !status) {
      return Response.json(
        { error: "borrowId dan status wajib diisi" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "returned"].includes(status)) {
      return Response.json({ error: "Status tidak valid" }, { status: 400 });
    }

    // Ambil detail peminjaman
    const [[borrow]] = await pool.query(
      "SELECT * FROM borrows WHERE id = ?",
      [borrowId]
    );

    if (!borrow)
      return Response.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );

    // Ambil detail user & buku
    const [[detail]] = await pool.query(
      `
      SELECT 
        b.id, 
        b.user_id AS userId, 
        b.book_id AS bookId, 
        bk.title
      FROM borrows b
      JOIN books bk ON b.book_id = bk.id
      WHERE b.id = ?
    `,
      [borrowId]
    );

    if (!detail)
      return Response.json(
        { error: "Detail peminjaman tidak ditemukan" },
        { status: 404 }
      );

    // ===== APPROVE =====
    if (status === "approved") {
      // Kurangi stok
      const [stockUpdate] = await pool.query(
        `UPDATE books SET stock = stock - 1 WHERE id = ? AND stock > 0`,
        [detail.bookId]
      );

      if (stockUpdate.affectedRows === 0) {
        return Response.json(
          { error: "Stok buku habis — tidak bisa approve" },
          { status: 400 }
        );
      }

      // Set return_date 10 hari dari sekarang
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 10);

      await pool.query(
        `UPDATE borrows SET status = ?, return_date = ? WHERE id = ?`,
        ["approved", returnDate, borrowId]
      );

      const message = `Peminjaman buku "${detail.title}" disetujui. Harap dikembalikan dalam 10 hari.`;

      await pool.query(
        `INSERT INTO notifications (user_id, borrow_id, type, message)
         VALUES (?, ?, ?, ?)`,
        [detail.userId, borrowId, "approved", message]
      );

      return Response.json(
        { message: "Peminjaman disetujui" },
        { status: 200 }
      );
    }

    // ===== REJECT =====
    if (status === "rejected") {
      await pool.query(
        `UPDATE borrows SET status = ? WHERE id = ?`,
        ["rejected", borrowId]
      );

      const message = `Peminjaman buku "${detail.title}" ditolak oleh admin.`;

      await pool.query(
        `INSERT INTO notifications (user_id, borrow_id, type, message)
         VALUES (?, ?, ?, ?)`,
        [detail.userId, borrowId, "rejected", message]
      );

      return Response.json(
        { message: "Peminjaman ditolak" },
        { status: 200 }
      );
    }

    // ===== RETURNED — student atau admin =====
    if (status === "returned") {
      await pool.query(
        `UPDATE borrows SET status = ?, return_date = ? WHERE id = ?`,
        ["returned", new Date(), borrowId]
      );

      // Tambah stok buku
      await pool.query(
        `UPDATE books SET stock = stock + 1 WHERE id = ?`,
        [detail.bookId]
      );

      const message = `Buku "${detail.title}" telah dikembalikan. Terima kasih.`;

      // FIXED → harus "returned", bukan "approved"
      await pool.query(
        `INSERT INTO notifications (user_id, borrow_id, type, message)
         VALUES (?, ?, ?, ?)`,
        [detail.userId, borrowId, "returned", message]
      );

      return Response.json(
        { message: "Buku berhasil dikembalikan" },
        { status: 200 }
      );
    }

    return Response.json({ error: "Status tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /borrows error:", error);
    return Response.json(
      { error: "Gagal memperbarui status" },
      { status: 500 }
    );
  }
}
