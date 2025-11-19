import pool from "@/lib/db";

// GET → Ambil semua data peminjaman
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        b.id,
        u.name AS student,
        u.address AS address, 
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

// POST → Student ajukan pinjaman
export async function POST(req) {
  try {
    const { userId, bookId } = await req.json();

    if (!userId || !bookId) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const borrowDate = new Date();

    await pool.query(
      `INSERT INTO borrows (user_id, book_id, borrow_date, status)
       VALUES (?, ?, ?, ?)`,
      [userId, bookId, borrowDate, "pending"]
    );

    return Response.json(
      { message: "Pengajuan pinjaman berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /borrows error:", error);
    return Response.json(
      { error: "Gagal mengajukan pinjaman" },
      { status: 500 }
    );
  }
}

// PATCH → Admin approve/reject
export async function PATCH(req) {
  try {
    const { borrowId, status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return Response.json({ error: "Status tidak valid" }, { status: 400 });
    }

    // Ambil data borrow
    const [[borrow]] = await pool.query(
      "SELECT * FROM borrows WHERE id = ?",
      [borrowId]
    );

    if (!borrow) {
      return Response.json(
        { error: "Data peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    // Ambil detail user & judul buku
    const [[detail]] = await pool.query(
      `SELECT b.id, u.id AS userId, bk.title 
       FROM borrows b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       WHERE b.id = ?`,
      [borrowId]
    );

    let message = "";

    if (status === "approved") {
      // Kurangi stok
      await pool.query(
        `UPDATE books SET stock = stock - 1 WHERE id = ? AND stock > 0`,
        [borrow.book_id]
      );

      // Set tanggal kembali (10 hari)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 10);

      await pool.query(
        `UPDATE borrows SET status = ?, return_date = ? WHERE id = ?`,
        ["approved", returnDate, borrowId]
      );

      message = `Peminjaman buku "${detail.title}" telah disetujui. Dikembalikan dalam 10 hari.`;

    } else {
      await pool.query(
        `UPDATE borrows SET status = ? WHERE id = ?`,
        ["rejected", borrowId]
      );

      message = `Peminjaman buku "${detail.title}" ditolak oleh admin.`;
    }

    // Insert ke tabel notifications
    await pool.query(
      `INSERT INTO notifications (user_id, borrow_id, type, message)
       VALUES (?, ?, ?, ?)`,
      [detail.userId, borrowId, status, message]
    );

    return Response.json(
      { message: "Status peminjaman diperbarui + notifikasi dikirim" },
      { status: 200 }
    );

  } catch (error) {
    console.error("PATCH /borrows error:", error);
    return Response.json(
      { error: "Gagal memperbarui status" },
      { status: 500 }
    );
  }
}
