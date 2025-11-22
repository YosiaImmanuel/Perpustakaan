"use client";
import { useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import Navbar from "@/components/Navbar";

export default function Notifications() {
  const [list, setList] = useState([]);

  const loadNotif = async () => {
    const sessionRes = await fetch("/api/session");
    const { user } = await sessionRes.json();

    const res = await fetch("/api/notifications", {
      headers: { "user-id": user.id },
    });

    setList(await res.json());
  };

  useEffect(() => {
    loadNotif();
  }, []);

  const markAsRead = async (id) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadNotif();
  };

  const deleteNotif = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus notifikasi ini?")) return;

    await fetch("/api/notifications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadNotif();
  };

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-2xl mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiBell className="text-amber-600" /> Notifikasi
        </h1>

        {list.length === 0 ? (
          <div className="text-gray-500 bg-gray-100 p-6 rounded-lg text-center shadow-sm">
            Tidak ada notifikasi saat ini.
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-xl border shadow-sm transition hover:shadow-md ${
                  n.is_read ? "bg-white border-gray-200" : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{n.message}</p>
                    <small className="text-gray-500">
                      {n.created_at.slice(0, 16)}
                    </small>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {n.is_read ? (
                      <FiCheckCircle className="text-green-600 text-xl" />
                    ) : (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Tandai dibaca
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotif(n.id)}
                      className="text-sm text-red-600 hover:text-red-700 underline flex items-center gap-1"
                    >
                      <FiTrash2 /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
