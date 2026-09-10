import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!tokenStore.access) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me/");
        if (active) setUser(data);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  async function login(username, password) {
    const { data } = await api.post("/auth/login/", { username, password });
    tokenStore.set({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register/", payload);
    tokenStore.set({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    return data.user;
  }

  function logout() {
    tokenStore.clear();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isFarmer: user?.role === "farmer",
      isConsumer: user?.role === "consumer",
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
