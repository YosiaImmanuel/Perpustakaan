"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [session, setSession] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setSession(data.user);
    };

    fetchData();
  }, [router]);

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <p className="text-gray-600 text-lg font-medium">Memuat halaman...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.jpg')", // kamu tinggal ganti file JPG sendiri
        }}
      />

      {/* Overlay putih blur */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* NAVBAR sticky */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* HERO TEXT */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 min-h-screen">

        <h1 className="text-5xl md:text-7xl font-extrabold text-amber-900 drop-shadow-xl">
          📚 Library
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-amber-800 max-w-2xl drop-shadow">
          Tempat di mana ilmu, cerita, dan inspirasi berkumpul dalam satu ruang
          yang modern dan nyaman.
        </p>

        <button
          onClick={() => router.push("/books")}
          className="mt-8 px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full text-lg shadow-lg transition"
        >
          Jelajahi Koleksi Buku →
        </button>
      </div>
    </div>
  );
}
