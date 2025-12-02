import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, name, address } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Query pakai pool.query agar tidak error
    const [result] = await pool.query(
      "UPDATE users SET name = ?, address = ? WHERE id = ?",
      [name, address, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile berhasil diperbarui!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("🔥 ERROR /api/profile:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profile", detail: error.message },
      { status: 500 }
    );
  }
}
