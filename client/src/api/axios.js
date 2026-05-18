import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const baseURL = config.baseURL || api.defaults.baseURL || "";
    const url = config.url || "";
    console.log(
      `API request: ${config.method?.toUpperCase() || "REQUEST"} ${baseURL}${url}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;