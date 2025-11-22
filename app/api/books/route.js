import { getBooks, addBook, deleteBook, updateBook } from "@/lib/actions";

/* =====================================
   GET — Ambil semua buku
===================================== */
export async function GET() {
  try {
    const books = await getBooks();

    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Gagal mengambil data buku" }),
      { status: 500 }
    );
  }
}

/* =====================================
   POST — Tambah buku baru
===================================== */
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, author, publisher, year, stock, category } = body;

    if (!title || !author || stock === undefined) {
      return new Response(
        JSON.stringify({
          error: "Field title, author, dan stock wajib diisi",
        }),
        { status: 400 }
      );
    }

    const newBook = await addBook({
      title,
      author,
      publisher,
      year,
      stock,
      category,
    });

    return new Response(JSON.stringify(newBook), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Gagal menambah buku" }),
      { status: 500 }
    );
  }
}

/* =====================================
   PUT — Update/Edit buku
===================================== */
export async function PUT(req) {
  try {
    const body = await req.json();

    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID wajib ada" }), { status: 400 });
    }

    const result = await updateBook(id, data);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

/* =====================================
   DELETE — Hapus buku
===================================== */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID buku harus disertakan" }),
        { status: 400 }
      );
    }

    const result = await deleteBook(id);

    if (!result || result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Buku tidak ditemukan" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Buku berhasil dihapus" }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Gagal menghapus buku" }),
      { status: 500 }
    );
  }
}
