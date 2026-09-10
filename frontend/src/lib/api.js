import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL });

const ACCESS_KEY = "nabta_access";
const REFRESH_KEY = "nabta_refresh";

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && !original._retry && tokenStore.refresh) {
      original._retry = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${baseURL}/auth/refresh/`, { refresh: tokenStore.refresh });
        const { data } = await refreshing;
        refreshing = null;
        tokenStore.set({ access: data.access, refresh: data.refresh });
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (err) {
        refreshing = null;
        tokenStore.clear();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const first = Object.values(data)[0];
  if (Array.isArray(first)) return first[0];
  if (typeof first === "string") return first;
  return fallback;
}
