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
} from "recharts";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardPage() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const auth = async () => {
      const s = await getSession();
      if (!s || s.user.role !== "admin") router.push("/home");
    };
    auth();

    const fetchData = async () => {
      const [bookRes, borrowRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/borrows"),
      ]);

      setBooks(await bookRes.json());
      setBorrows(await borrowRes.json());
    };
    fetchData();
  }, [router]);

  // Chart data
  const data = [
    { name: "Disetujui", total: borrows.filter((b) => b.status === "approved").length },
    { name: "Pending", total: borrows.filter((b) => b.status === "pending").length },
    { name: "Ditolak", total: borrows.filter((b) => b.status === "rejected").length },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Mobile Sidebar Button */}
        <button
          onClick={() => setOpenSidebar(true)}
          className="md:hidden bg-amber-600 text-white px-3 py-2 rounded mb-4"
        >
          ☰ Menu
        </button>

        <h1 className="text-2xl font-bold mb-6">📊 Dashboard Admin</h1>

        {/* ======= 3 Cards ======= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Total Buku */}
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h2 className="text-2xl font-bold">{books.length}</h2>
            <p className="text-gray-700">Total Buku</p>
          </div>

          {/* Total Peminjaman */}
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h2 className="text-2xl font-bold">{borrows.length}</h2>
            <p className="text-gray-700">Total Peminjaman</p>
          </div>

          {/* Returned */}
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <h2 className="text-2xl font-bold">
              {borrows.filter((b) => b.status === "returned").length}
            </h2>
            <p className="text-gray-700">Returned</p>
          </div>

        </div>

        {/* ======= CHART ======= */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Status Peminjaman</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
