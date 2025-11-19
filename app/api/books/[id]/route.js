import { getBook } from "@/lib/actions";

export async function GET(req, { params }) {
  const { id } = await params; // ✅ di Next.js 15 params adalah Promise
  if (!id) {
    return Response.json({ error: "ID buku tidak ditemukan" }, { status: 400 });
  }

  try {
    const book = await getBook(id);

    if (!book) {
      return Response.json({ error: "Buku tidak ditemukan" }, { status: 404 });
    }

    return Response.json(book);
  } catch (err) {
    console.error("Error saat mengambil buku:", err);
    return Response.json({ error: "Gagal mengambil data buku" }, { status: 500 });
  }
}
