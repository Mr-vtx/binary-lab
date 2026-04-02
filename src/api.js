import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, 
});


function getCSRF() {
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("csrfToken="))
      ?.split("=")[1] || ""
  );
}

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    config.headers["x-csrf-token"] = getCSRF();
  }
  return config;
});

let refreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;

    if (
      status === 401 &&
      !original._retry &&
      !original.url?.includes("refresh")
    ) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((e) => Promise.reject(e));
      }

      original._retry = true;
      refreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr);
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshErr);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(err);
  },
);

export default api;
