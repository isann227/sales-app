import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../Context/AuthContext";
import { Bar, Line, Pie } from "react-chartjs-2";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function DashboardSuperAdmin() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [userGrowth, setUserGrowth] = useState([]);
  const [salesPerProduct, setSalesPerProduct] = useState([
    { product: "Produk A", sales: 120 },
    { product: "Produk B", sales: 80 },
    { product: "Produk C", sales: 60 },
  ]);
  const [categoryDistribution, setCategoryDistribution] = useState([
    { category: "Elektronik", value: 40 },
    { category: "Fashion", value: 30 },
    { category: "Makanan", value: 30 },
  ]);

  useEffect(() => {
    api.get("/dashboard/summary").then(res => setSummary(res.data));
    api.get("/dashboard/user-growth").then(res => setUserGrowth(res.data));
    // TODO: fetch salesPerProduct dan categoryDistribution dari backend jika sudah ada
  }, []);

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";
  const profileImg = user?.profileImageUrl && user.profileImageUrl.trim() !== "" ? (user.profileImageUrl.startsWith("/image/") ? `${IMAGE_URL}${user.profileImageUrl}` : user.profileImageUrl) : null;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">Dashboard Super Admin</div>
        {user && (
          <button className="flex items-center gap-2" onClick={() => window.location.href = "/dashboard/profile"} title="Lihat Profil">
            {profileImg ? (
              <img src={profileImg} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300" />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-indigo-300" />
            )}
            <span className="ml-2 text-base font-semibold text-gray-700">{user.name}</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-500">Jumlah Pengguna</div>
          <div className="text-2xl font-bold">{summary.userCount}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-500">Total Order</div>
          <div className="text-2xl font-bold">{summary.orderCount}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-500">Pendapatan</div>
          <div className="text-2xl font-bold">Rp {summary.totalRevenue?.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-500">Notifikasi Baru</div>
          <div className="text-2xl font-bold">{summary.notifCount}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="font-semibold mb-2">Pertumbuhan User per Bulan</div>
          <Line
            data={{
              labels: userGrowth.map(d => d.month),
              datasets: [{
                label: "User Baru",
                data: userGrowth.map(d => d.count),
                backgroundColor: "#6366f1",
                borderColor: "#6366f1",
                tension: 0.4,
                fill: false,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true } }
            }}
          />
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="font-semibold mb-2">Penjualan per Produk</div>
          <Bar
            data={{
              labels: salesPerProduct.map(d => d.product),
              datasets: [{
                label: "Penjualan",
                data: salesPerProduct.map(d => d.sales),
                backgroundColor: ["#6366f1", "#f59e42", "#10b981"],
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="font-semibold mb-2">Distribusi Kategori Produk</div>
          <Pie
            data={{
              labels: categoryDistribution.map(d => d.category),
              datasets: [{
                data: categoryDistribution.map(d => d.value),
                backgroundColor: ["#6366f1", "#f59e42", "#10b981"],
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "bottom" } }
            }}
          />
        </div>
        {/* Chart lain jika perlu */}
      </div>
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="font-semibold mb-2">Daftar Pengguna Terbaru</div>
        {/* Table user, order, dsb */}
      </div>
      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Aktivitas Terakhir</div>
        {/* List aktivitas dari endpoint log */}
      </div>
    </div>
  );
}
