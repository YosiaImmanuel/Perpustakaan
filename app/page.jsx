"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();

  const heroRef = useRef(null);
  const infoRef = useRef([]);
  const [heroVisible, setHeroVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState([false, false, false]);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observers = [];
    infoRef.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInfoVisible((prev) => {
              const newState = [...prev];
              newState[i] = true;
              return newState;
            });
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 font-sans">
      {/* Navbar */}
      <nav className="w-full bg-amber-100 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-20 flex items-center justify-between h-16">
          <div
            className="text-2xl font-extrabold text-amber-900 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Library
          </div>
          <div className="hidden md:flex space-x-8 text-amber-800 font-bold text-lg">
            <button onClick={() => router.push("/")} className="relative group">
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-700 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => router.push("/about")} className="relative group">
              Tentang
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-700 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => router.push("/books")} className="relative group">
              Koleksi
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-700 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => router.push("/contact")} className="relative group">
              Kontak
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-700 transition-all group-hover:w-full"></span>
            </button>
          </div>
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-5 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-white border-2 border-amber-800 text-amber-800 font-semibold px-5 py-2 rounded-lg hover:bg-amber-50 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 rounded-b-3xl shadow-lg transform transition-all duration-1000 ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-6 leading-tight">
            Website Perpustakaan <br /> Modern & Profesional
          </h1>
          <p className="text-amber-700 mb-8 text-lg">
            Temukan dan kelola koleksi buku dengan mudah. Nikmati pengalaman membaca yang nyaman dan menyenangkan.
          </p>
          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => router.push("/register")}
              className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Jelajahi Sekarang
            </button>
          </div>
        </div>

        <div className="mb-10 md:mb-0">
          <img
            src={"/background.jpg"}
            alt="Books"
            width={500}
            height={400}
            className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">
          Mengapa Memilih Perpustakaan Kami?
        </h2>
        <p className="max-w-3xl mx-auto text-amber-700 mb-12 text-lg">
          Kami menyediakan akses mudah ke berbagai koleksi buku, sistem manajemen transaksi yang efisien, serta pengalaman pengguna yang modern dan nyaman.
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {["books1.jpg", "books2.jpg", "books3.jpg"].map((img, i) => (
            <div
              key={i}
              ref={(el) => (infoRef.current[i] = el)}
              className={`bg-amber-50 p-8 rounded-2xl shadow-lg transform transition-all duration-700 ${
                infoVisible[i] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
              } hover:-translate-y-2 hover:scale-105 hover:shadow-2xl`}
            >
              <Image
                src={`/${img}`}
                alt={`Card ${i + 1}`}
                width={300}
                height={200}
                className="rounded-xl mb-6 mx-auto"
              />
              <h3 className="font-semibold text-xl text-amber-900 mb-3">
                {i === 0 && "Koleksi Lengkap"}
                {i === 1 && "Mudah Diakses"}
                {i === 2 && "Transaksi Aman"}
              </h3>
              <p className="text-amber-700 text-sm">
                {i === 0 &&
                  "Dari fiksi, non-fiksi, hingga akademik — semua tersedia di satu tempat."}
                {i === 1 &&
                  "Akses kapan saja, di mana saja melalui platform berbasis web."}
                {i === 2 &&
                  "Setiap peminjaman dan pengembalian buku tercatat dengan baik dan aman."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white text-center py-8 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Digital | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
