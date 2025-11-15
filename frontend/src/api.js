import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach access token to every request if present (except public endpoints)
api.interceptors.request.use((config) => {
  const url = config.url || "";
  const method = (config.method || "").toLowerCase();

  // Always remove Authorization header first (will re-add only if needed)
  if (config.headers) delete config.headers.Authorization;

  // Don't attach token for token endpoints or public user registration
  // (prevent invalid/expired access tokens from causing 401 before AllowAny permission)
  if (url.includes("/token/") || (url.includes("/users") && method === "post")) {
    return config;
  }

  // Attach token for all authenticated endpoints
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to handle expired access tokens.
// If access token is expired, attempt to refresh using the stored refresh token
// and retry the original request once.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh once per request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const respData = error.response.data || {};

      // SimpleJWT returns code 'token_not_valid' when access token expired/invalid
      if (respData.code === "token_not_valid" || respData.detail?.toLowerCase?.().includes("token")) {
        originalRequest._retry = true;
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) {
          // No refresh token available - redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          // Use a plain axios call (not `api`) to avoid interceptors recursion
          const result = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
          const newAccess = result.data.access;
          // Persist new access token
          localStorage.setItem("access_token", newAccess);

          // Update auth headers for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          // Retry the original request with new token
          return api(originalRequest);
        } catch (err) {
          // Refresh failed (refresh expired or invalid) -> clear storage and force login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

