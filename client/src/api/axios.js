import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? "/api" : "http://127.0.0.1:3000/api");

const api = axios.create({
  baseURL,
});

// Add a request interceptor to handle FormData and add auth token
api.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, let the browser set the Content-Type header
    if (config.data instanceof FormData) {
      // Remove the Content-Type header so FormData can set it automatically
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;