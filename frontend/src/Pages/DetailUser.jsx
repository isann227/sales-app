import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function DetailUser() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (user?.role !== "SUPERADMIN") return;
    api.get(`/users/${id}`).then(res => setDetail(res.data));
  }, [id, user]);

  if (user?.role !== "SUPERADMIN") return <div>Forbidden</div>;
  if (!detail) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Detail User</h2>
      <div className="space-y-2">
        <div><b>ID:</b> {detail.id}</div>
        <div><b>Nama:</b> {detail.name}</div>
        <div><b>Email:</b> {detail.email}</div>
        <div><b>Role:</b> {detail.role}</div>
        <div><b>Verified:</b> {detail.isVerified ? "Ya" : "Tidak"}</div>
        <div><b>Dibuat:</b> {new Date(detail.createdAt).toLocaleString()}</div>
        <div><b>Diupdate:</b> {new Date(detail.updatedAt).toLocaleString()}</div>
      </div>
    </div>
  );
}