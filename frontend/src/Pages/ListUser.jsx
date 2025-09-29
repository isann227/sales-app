import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListUser() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "SUPERADMIN") return;
    api.get("/users").then(res => setUsers(res.data));
  }, [user]);

  if (user?.role !== "SUPERADMIN") return <div>Forbidden</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Daftar User</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Verified</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.role}</td>
              <td className="border px-2 py-1">{u.isVerified ? "Ya" : "Tidak"}</td>
              <td className="border px-2 py-1">
                <button
                  className="text-indigo-600 underline"
                  onClick={() => navigate(`/dashboard/users/${u.id}`)}
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}