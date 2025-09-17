import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);   // true saat refresh / cek token
  const [initializing, setInitializing] = useState(true); // true hanya sekali di awal

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user, token]);

  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setLoading(false);
        setInitializing(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/check");
        // Otomatis deteksi struktur response user
        let userData = undefined;
        if (data?.data) userData = data.data;
        else if (data?.user) userData = data.user;
        else userData = data;
        console.log("User after /auth/check:", userData);
        setUser(userData);
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };
    checkSession();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async (name, email, password, role = "USER") => {
    const { data } = await api.post("/auth/register", { name, email, password, role });
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout error:", e.message);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
