"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Book, Bell, BarChart3, CheckCircle, XCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const handleAlertClose = () => {
    setAlert({ show: false, type: "", message: "" });
    
    if (shouldRedirect) {
      router.refresh();
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          const role = data?.user?.role;
          if (role === "admin") router.push("/admin/dashboard");
          else router.push("/books");
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      showAlert("error", "Email atau password salah!");
      setLoading(false);
      setShouldRedirect(false);
      return;
    }

    showAlert("success", "Login berhasil! Klik OK untuk melanjutkan.");
    setLoading(false);
    setShouldRedirect(true);
  };

  const features = [
    { Icon: Book, text: "Akses banyak koleksi buku" },
    { Icon: Bell, text: "Notifikasi peminjaman real-time" },
    { Icon: BarChart3, text: "Lacak riwayat bacaan Anda" }
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Custom Alert Modal */}
      {alert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div 
            className={`
              relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full
              transform transition-all duration-300 ease-out
              ${alert.show ? "scale-100 opacity-100" : "scale-90 opacity-0"}
            `}
          >
            <div className="flex justify-center mb-6">
              {alert.type === "success" ? (
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-shake">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {alert.type === "success" ? "Login Berhasil!" : "Login Gagal!"}
              </h3>
              <p className="text-gray-600">
                {alert.message}
              </p>
            </div>

            <button
              onClick={handleAlertClose}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all duration-300
                ${alert.type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
                }
              `}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/library.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col md:flex-row">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-20 text-white">
          <div 
            className="text-3xl font-bold mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          >
            Library
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Selamat Datang<br />Kembali!
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
            Masuk ke akun Anda dan lanjutkan perjalanan membaca yang menginspirasi bersama ribuan koleksi buku terbaik.
          </p>
          
          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <feature.Icon className="w-6 h-6 text-gray-300" />
                <span className="text-gray-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center items-center md:w-1/2 p-6 md:p-10">
          <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-md border-2 border-gray-200">
            
            {/* Mobile Logo */}
            <div className="md:hidden mb-6 text-center">
              <div 
                className="text-2xl font-bold text-gray-900 cursor-pointer inline-block"
                onClick={() => router.push("/")}
              >
                Library
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Login
              </h2>
              <p className="text-gray-600">Masuk ke akun perpustakaan Anda</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-gray-900 placeholder-gray-400 bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-gray-900 placeholder-gray-400 bg-gray-50"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-gray-600">Ingat saya</span>
                </label>
                <button 
                  type="button"
                  className="text-gray-900 hover:underline font-medium"
                >
                  Lupa password?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800 active:scale-95"
                } text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  "Masuk ke Akun"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Belum punya akun?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-gray-500 text-sm hover:text-gray-900 transition-colors inline-flex items-center space-x-1"
              >
                <span>←</span>
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="md:hidden mt-8 space-y-3 text-white px-6 max-w-md">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <feature.Icon className="w-5 h-5 text-gray-200" />
                <span className="text-sm text-gray-200">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}