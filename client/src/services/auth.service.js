import api from "../api/axios.js";

export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const fullUrl = `${api.defaults.baseURL || "http://localhost:3000"}/api/auth/login`;
  console.log("loginUser request URL:", fullUrl);
  const response = await api.post("/api/auth/login", payload);
  return response.data;
};
