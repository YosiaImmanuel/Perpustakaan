"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      toast.error("❌ Email atau password salah!", {
        style: {
          borderRadius: "10px",
          background: "#fee2e2",
          color: "#7f1d1d",
        },
      });
      setLoading(false);
      return;
    }

    // Ambil data session setelah login
    const session = await getSession();

    toast.success("✅ Login berhasil! Selamat datang kembali 👋", {
      style: {
        borderRadius: "10px",
        background: "#fef3c7",
        color: "#78350f",
      },
    });

    // Arahkan sesuai role
    setTimeout(() => {
      if (session?.user?.role === "admin") {
        router.push("/admin/books");
      } else {
        router.push("/home");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-10">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-6 text-center text-amber-800">
            Login ke Akun Anda
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-amber-300 cursor-not-allowed"
                  : "bg-amber-700 hover:bg-amber-800"
              } text-white p-3 rounded-md font-semibold transition`}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Belum punya akun?{" "}
            <span
              className="text-amber-700 cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-100">
        <Image
          src="/library.jpg"
          alt="Library Illustration"
          width={600}
          height={600}
          className="rounded-2xl object-cover shadow-lg"
        />
      </div>
    </div>
  );
}
