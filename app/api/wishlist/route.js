import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Ambil semua wishlist user
export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const [rows] = await pool.query(
      `
      SELECT w.book_id, b.title, b.author, b.publisher, b.year, b.category, b.stock
      FROM wishlists w
      JOIN books b ON b.id = w.book_id
      WHERE w.user_id = ?
      `,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Tambah wishlist
export async function POST(req) {
  try {
    const { userId, bookId } = await req.json();

    await pool.query(
      "INSERT IGNORE INTO wishlists (user_id, book_id) VALUES (?, ?)",
      [userId, bookId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Hapus buku dari wishlist
export async function DELETE(req) {
  try {
    const { userId, bookId } = await req.json();

    await pool.query(
      "DELETE FROM wishlists WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
