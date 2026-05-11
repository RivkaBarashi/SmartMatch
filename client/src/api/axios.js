import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add a request interceptor to handle FormData
api.interceptors.request.use(
  (config) => {
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