"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  HiViewGrid,
  HiBookOpen,
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiTrendingUp,
  HiRefresh,
} from "react-icons/hi";

export default function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = async () => {
      const s = await getSession();
      if (!s || s.user.role !== "admin") {
        router.push("/home");
        return;
      }
    };
    auth();

    const fetchData = async () => {
      try {
        const [bookRes, borrowRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/borrows"),
        ]);

        setBooks(await bookRes.json());
        setBorrows(await borrowRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Statistics
  const stats = {
    totalBooks: books.length,
    totalBorrows: borrows.length,
    approved: borrows.filter((b) => b.status === "approved").length,
    pending: borrows.filter((b) => b.status === "pending").length,
    rejected: borrows.filter((b) => b.status === "rejected").length,
    returned: borrows.filter((b) => b.status === "returned").length,
  };

  // Bar Chart data
  const barChartData = [
    { name: "Disetujui", total: stats.approved, color: "#10b981" },
    { name: "Pending", total: stats.pending, color: "#f59e0b" },
    { name: "Ditolak", total: stats.rejected, color: "#ef4444" },
    { name: "Dikembalikan", total: stats.returned, color: "#3b82f6" },
  ];

  // Pie Chart data
  const pieChartData = [
    { name: "Disetujui", value: stats.approved, color: "#10b981" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Ditolak", value: stats.rejected, color: "#ef4444" },
    { name: "Dikembalikan", value: stats.returned, color: "#3b82f6" },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <div>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <HiViewGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                  <p className="text-gray-600">Selamat datang di panel admin perpustakaan</p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <HiRefresh className="w-5 h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Total Books Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                  <HiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>Total</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBooks}</h3>
              <p className="text-gray-600 text-sm font-medium">Total Buku</p>
            </div>

            {/* Total Borrows Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                  <HiClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>All Time</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBorrows}</h3>
              <p className="text-gray-600 text-sm font-medium">Total Peminjaman</p>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-md">
                  <HiClock className="w-6 h-6 text-white" />
                </div>
                {stats.pending > 0 && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    Perlu Aksi
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
              <p className="text-gray-600 text-sm font-medium">Menunggu Approval</p>
            </div>

            {/* Returned Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                  <HiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.returned}</h3>
              <p className="text-gray-600 text-sm font-medium">Dikembalikan</p>
            </div>

          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <HiClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Status Peminjaman</h2>
                  <p className="text-sm text-gray-600">Grafik statistik peminjaman buku</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <HiViewGrid className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Distribusi Status</h2>
                  <p className="text-sm text-gray-600">Persentase status peminjaman</p>
                </div>
              </div>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  Belum ada data peminjaman
                </div>
              )}
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <button
                onClick={() => router.push("/admin/books")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all group"
              >
                <HiBookOpen className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Kelola Buku</p>
                  <p className="text-xs text-gray-600">Tambah & edit buku</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/koleksi")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl transition-all group"
              >
                <HiClipboardList className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Koleksi Buku</p>
                  <p className="text-xs text-gray-600">Lihat semua koleksi</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/history")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all group"
              >
                <HiCheckCircle className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Riwayat</p>
                  <p className="text-xs text-gray-600">Lihat riwayat peminjaman</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/books")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl transition-all group"
              >
                <HiClock className="w-6 h-6 text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Pending Request</p>
                  <p className="text-xs text-gray-600">{stats.pending} menunggu</p>
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}