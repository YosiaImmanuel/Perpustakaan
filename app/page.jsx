"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { FiSearch, FiBell, FiBarChart2, FiHeart } from "react-icons/fi";


export default function LandingPage() {
  const router = useRouter();

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const infoRef = useRef([]);
  const [heroVisible, setHeroVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState([false, false, false]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 md:px-20 flex items-center justify-between h-20">
          <div
            className="text-2xl font-bold text-gray-900 cursor-pointer tracking-tight"
            onClick={() => scrollToSection(heroRef)}
          >
            Library
          </div>
          <div className="hidden md:flex space-x-10 text-gray-700 font-medium text-base">
            <button onClick={() => scrollToSection(heroRef)} className="relative group hover:text-gray-900 transition-colors">
              Beranda
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection(aboutRef)} className="relative group hover:text-gray-900 transition-colors">
              Tentang
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection(featuresRef)} className="relative group hover:text-gray-900 transition-colors">
              Fitur
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection(contactRef)} className="relative group hover:text-gray-900 transition-colors">
              Kontak
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </button>
          </div>
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transform hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-white border-2 border-gray-900 text-gray-900 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 shadow-sm transform hover:scale-105 transition-all duration-300"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background - BERANDA */}
      <section
        ref={heroRef}
        className={`relative flex items-center justify-center px-6 md:px-20 py-24 overflow-hidden transform transition-all duration-1000 ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/40"></div>
        
        <div className="relative z-10 max-w-3xl text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full">
            ✨ Modern & Professional
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Website Perpustakaan <br />
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Modern & Profesional
            </span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Temukan dan kelola koleksi buku dengan mudah. Nikmati pengalaman membaca yang nyaman dan menyenangkan.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/register")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Jelajahi Sekarang
            </button>
            <button
              onClick={() => router.push("/books")}
              className="bg-white border-2 border-gray-300 hover:border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-sm transform hover:scale-105 transition-all duration-300"
            >
              Lihat Koleksi
            </button>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="py-24 px-6 md:px-20 text-center bg-white scroll-mt-20">
    <div className="max-w-7xl mx-auto">
      <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
        Mengapa Kami?
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Mengapa Memilih Perpustakaan Kami?
      </h2>
      <p className="max-w-3xl mx-auto text-gray-600 mb-16 text-lg leading-relaxed">
        Kami menyediakan akses mudah ke berbagai koleksi buku, sistem manajemen transaksi yang efisien, serta pengalaman pengguna yang modern dan nyaman.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (infoRef.current[i] = el)}
            className={`group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 transform transition-all duration-700 ${
              infoVisible[i]
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-10 scale-95"
            } hover:-translate-y-3 hover:shadow-2xl hover:border-gray-900`}
          >
            {/* Tanpa gambar */}
            <h3 className="font-bold text-2xl text-gray-900 mb-4">
              {i === 0 && "Koleksi Lengkap"}
              {i === 1 && "Mudah Diakses"}
              {i === 2 && "Transaksi Aman"}
            </h3>

            <p className="text-gray-600 text-base leading-relaxed">
              {i === 0 &&
                "Dari Pemrograman, Umum, Novel, semua tersedia di satu tempat."}
              {i === 1 &&
                "Akses kapan saja, di mana saja melalui platform berbasis web."}
              {i === 2 &&
                "Setiap peminjaman dan pengembalian buku tercatat dengan baik dan aman."}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

      {/* Features Detail Section - FITUR */}
      <section ref={featuresRef} className="py-24 px-6 md:px-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gray-900 text-white text-sm font-semibold rounded-full">
              Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fitur yang Memudahkan Anda
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Pencarian Cepat & Akurat", desc: "Temukan buku yang Anda cari dalam hitungan detik dengan sistem pencarian cerdas kami.", Icon: FiSearch },
              { title: "Notifikasi Real-time", desc: "Dapatkan pemberitahuan langsung untuk tenggat pengembalian dan buku favorit yang tersedia.", Icon: FiBell },
              { title: "Riwayat Peminjaman", desc: "Lacak semua aktivitas peminjaman Anda dengan mudah dan detail.", Icon: FiBarChart2 },
              { title: "Wishlist Buku", desc: "Simpan buku favorit Anda dan dapatkan notifikasi saat tersedia.", Icon: FiHeart }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 transform transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:border-gray-900"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.Icon className="text-white text-3xl" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Siap Memulai Perjalanan Membaca Anda?
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Bergabunglah dengan ribuan pembaca lainnya dan nikmati akses tak terbatas ke koleksi buku terbaik. Daftar sekarang gratis!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/register")}
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-10 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Daftar Gratis
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold px-10 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Footer - KONTAK */}
      <footer ref={contactRef} className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Library</h3>
              <p className="text-sm leading-relaxed">Platform perpustakaan digital modern untuk semua kebutuhan membaca dan belajar Anda.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection(heroRef)} className="hover:text-white transition-colors">Beranda</button></li>
                <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-white transition-colors">Tentang</button></li>
                <li><button onClick={() => scrollToSection(featuresRef)} className="hover:text-white transition-colors">Fitur</button></li>
                <li><button onClick={() => scrollToSection(contactRef)} className="hover:text-white transition-colors">Kontak</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">Peminjaman Buku</button></li>
                <li><button className="hover:text-white transition-colors">E-Book</button></li>
                <li><button className="hover:text-white transition-colors">Reservasi</button></li>              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: library@gmail.com</li>
                <li>Phone: 0895-3409-92045 </li>
                <li>Address: Depok, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm mb-4">
              © {new Date().getFullYear()} Perpustakaan Digital | All Rights Reserved
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}