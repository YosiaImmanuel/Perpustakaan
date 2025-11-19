"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { hash } from "bcryptjs";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(""); // NEW
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !address) {
      toast.error("❌ Semua field harus diisi!", {
        style: {
          borderRadius: "0px",
          background: "#fee2e2",
          color: "#7f1d1d",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const hashedPassword = await hash(password, 10);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address, // NEW
          password: hashedPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Registrasi berhasil! Selamat datang 👋", {
          style: {
            borderRadius: "0px",
            background: "#fef3c7",
            color: "#78350f",
          },
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(data.message || "❌ Terjadi kesalahan saat registrasi.", {
          style: {
            borderRadius: "0px",
            background: "#fee2e2",
            color: "#7f1d1d",
          },
        });
      }
    } catch (error) {
      toast.error("❌ Gagal melakukan registrasi. Silakan coba lagi.", {
        style: {
          borderRadius: "0px",
          background: "#fee2e2",
          color: "#7f1d1d",
        },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/library-bg.jpg')" }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Box utama */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl p-10 w-full max-w-3xl flex flex-col md:flex-row items-center gap-8 border border-gray-300">

        {/* Form Kiri */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold text-amber-800 mb-6 text-center md:text-left">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900 rounded-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900 rounded-none"
                required
              />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Contoh No. 123, Kecamatan, Kota"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900 rounded-none h-24 resize-none"
                required
              ></textarea>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900 rounded-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white p-3 font-semibold transition rounded-none 
                ${
                  loading
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-700 hover:bg-amber-800"
                }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <span
              className="text-amber-700 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* Gambar / Logo */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
          <Image
            src="/backgroundtb.jpg"
            alt="Library Logo"
            width={160}
            height={160}
            className="object-contain mb-4"
          />
          <p className="text-gray-700 font-medium text-center">
            Selamat datang di sistem perpustakaan modern 📚
          </p>
        </div>

      </div>
    </div>
  );
}
