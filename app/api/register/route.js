import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, address, password } = await req.json();

    if (!name || !email || !password || !address) {
      return Response.json({ message: "Semua field harus diisi!" }, { status: 400 });
    }

    // Cek apakah user sudah ada
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return Response.json({ message: "Email sudah terdaftar!" }, { status: 400 });
    }

    // Simpan user baru
    await pool.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, 'student')",
      [name, email, address, password]
    );

    return Response.json({ message: "Registrasi berhasil!" }, { status: 201 });
  } catch (error) {
    console.error("Error register:", error);
    return Response.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
