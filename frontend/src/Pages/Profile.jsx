import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", { name, email, password: password || undefined });
      setUser(data);
      toast.success("Profil berhasil diupdate");
    } catch (err) {
      toast.error("Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Unauthorized</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Profil Saya</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nama"
        />
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password baru (opsional)"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}