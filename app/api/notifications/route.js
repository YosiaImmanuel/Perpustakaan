import pool from "@/lib/db";

// GET semua notifikasi user
export async function GET(req) {
  const userId = req.headers.get("user-id");

  const [rows] = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [userId]
  );

  return Response.json(rows);
}

// PATCH → tandai sudah dibaca
export async function PATCH(req) {
  const { id } = await req.json();

  await pool.query(
    `UPDATE notifications SET is_read = 1 WHERE id = ?`,
    [id]
  );

  return Response.json({ message: "dibaca" });
}

// DELETE → hapus notifikasi
export async function DELETE(req) {
  const { id } = await req.json();

  await pool.query(
    `DELETE FROM notifications WHERE id = ?`,
    [id]
  );

  return Response.json({ message: "dihapus" });
}
