"use client";
import { useEffect, useState } from "react";
import { 
  HiBell, 
  HiCheckCircle, 
  HiTrash, 
  HiCheck,
  HiX,
  HiInformationCircle
} from "react-icons/hi";
import UserSidebar from "@/components/UserSidebar";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadNotif = async () => {
    setLoading(true);
    try {
      const sessionRes = await fetch("/api/session");
      const { user } = await sessionRes.json();

      const res = await fetch("/api/notifications", {
        headers: { "user-id": user.id },
      });

      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotif();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadNotif();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!confirm("Tandai semua notifikasi sebagai dibaca?")) return;
    
    try {
      // Mark all unread notifications as read
      await Promise.all(
        list.filter(n => !n.is_read).map(n => 
          fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: n.id }),
          })
        )
      );
      loadNotif();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotif = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus notifikasi ini?")) return;

    try {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadNotif();
      alert("✅ Notifikasi berhasil dihapus");
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("❌ Gagal menghapus notifikasi");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approved":
        return <HiCheckCircle className="w-6 h-6 text-green-600" />;
      case "rejected":
        return <HiX className="w-6 h-6 text-red-600" />;
      case "returned":
        return <HiCheck className="w-6 h-6 text-blue-600" />;
      default:
        return <HiInformationCircle className="w-6 h-6 text-amber-600" />;
    }
  };

  const filteredList = filter === "all" 
    ? list 
    : filter === "unread" 
      ? list.filter(n => !n.is_read)
      : list.filter(n => n.is_read);

  const unreadCount = list.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <UserSidebar />
        <div className="lg:ml-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Memuat notifikasi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UserSidebar />

      {/* Main Content */}
      <div className="lg:ml-16 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <HiBell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
                  <p className="text-gray-600">
                    {unreadCount > 0 
                      ? `${unreadCount} notifikasi belum dibaca`
                      : "Semua notifikasi sudah dibaca"}
                  </p>
                </div>
              </div>

              {/* Mark All as Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                >
                  <HiCheckCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "Semua", count: list.length },
                { value: "unread", label: "Belum Dibaca", count: unreadCount },
                { value: "read", label: "Sudah Dibaca", count: list.length - unreadCount },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filter === tab.value
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === tab.value 
                      ? "bg-white text-amber-600" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          
          {/* Empty State */}
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <HiBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-600 mb-2">
                {filter === "all" 
                  ? "Tidak ada notifikasi"
                  : filter === "unread"
                    ? "Tidak ada notifikasi belum dibaca"
                    : "Tidak ada notifikasi yang sudah dibaca"}
              </p>
              <p className="text-gray-500">
                Notifikasi akan muncul di sini ketika ada pembaruan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredList.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all border overflow-hidden ${
                    notif.is_read 
                      ? "border-gray-200" 
                      : "border-amber-200 ring-2 ring-amber-100"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          notif.is_read 
                            ? "bg-gray-100" 
                            : "bg-amber-50"
                        }`}>
                          {getNotificationIcon(notif.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className={`text-gray-900 ${
                            notif.is_read ? "font-normal" : "font-semibold"
                          }`}>
                            {notif.message}
                          </p>
                          
                          {/* Unread Badge */}
                          {!notif.is_read && (
                            <span className="flex-shrink-0 w-3 h-3 bg-amber-600 rounded-full animate-pulse"></span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                          {formatDate(notif.created_at)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {!notif.is_read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              <HiCheckCircle className="w-4 h-4" />
                              Tandai Dibaca
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotif(notif.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            <HiTrash className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Read Status Bar */}
                  {notif.is_read && (
                    <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-600" />
                        <span>Sudah dibaca</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {filteredList.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Menampilkan <span className="font-semibold text-gray-900">{filteredList.length}</span> dari{" "}
              <span className="font-semibold text-gray-900">{list.length}</span> notifikasi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}