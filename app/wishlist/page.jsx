"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";

export default function WishlistPage() {
  const [books, setBooks] = useState([]);
  const [session, setSession] = useState(null);
  const router = useRouter();

  const categoryNames = {
    1: "Pemrograman",
    2: "Umum",
    3: "Novel",
  };

  useEffect(() => {
    const load = async () => {
      const s = await fetch("/api/session");
      const sess = await s.json();
      setSession(sess.user);

      const res = await fetch("/api/wishlist", {
        headers: { "x-user-id": sess.user.id },
      });

      const data = await res.json();
      setBooks(data);
    };

    load();
  }, []);

  const pinjamBuku = (bookId) => {
    router.push(`/borrow/${bookId}`);
  };

  // 🗑 Hapus wishlist
  const removeWishlist = async (bookId, e) => {
    e.stopPropagation();

    const res = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.id,
      },
      body: JSON.stringify({
        userId: session.id,
        bookId: bookId,
      }),
    });

    if (res.ok) {
      // Hapus dari state agar UI langsung update
      setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-6 md:px-20 py-10">
      <h1 className="text-3xl font-extrabold text-amber-900 mb-6">
        ❤️ Wishlist Anda
      </h1>

      {books.length === 0 ? (
        <div className="mt-10 bg-gray-100 p-5 text-center rounded-lg">
          Belum ada buku di wishlist.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((b) => (
            <div
              key={b.book_id}
              onClick={() => router.push(`/books/${b.book_id}`)}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              
              {/* ❤️ tombol hapus wishlist */}
              <button
                className="absolute top-3 right-3 text-pink-500 text-2xl"
                onClick={(e) => removeWishlist(b.book_id, e)}
              >
                <FaHeart className="text-pink-500 drop-shadow-md" />
              </button>

              <div className="flex items-center justify-center w-full h-56 bg-amber-100 text-6xl text-amber-700">
                📘
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{b.author}</p>
                  <p className="text-xs text-gray-500">
                    {b.publisher} • {b.year}
                  </p>

                  <p className="mt-2 text-xs text-amber-700 bg-amber-100 inline-block px-2 py-1 rounded-md font-medium">
                    🏷 {categoryNames[b.category] || "Tidak diketahui"}
                  </p>
                </div>

                <div className="mt-4">
                  {b.stock > 0 ? (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full font-medium">
                      📗 Tersedia ({b.stock})
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full font-medium">
                      📕 Stok Habis
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (b.stock > 0) pinjamBuku(b.book_id);
                  }}
                  className={`mt-4 w-full px-4 py-2 rounded-lg font-medium text-white shadow-md transition ${
                    b.stock > 0
                      ? "bg-amber-700 hover:bg-amber-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {b.stock > 0 ? "📚 Pinjam Buku" : "Tidak Tersedia"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
