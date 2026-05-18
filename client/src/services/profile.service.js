import api from "../api/axios.js";

export const createProfile = async (data) => {
  const config = {};

  if (data instanceof FormData) {
    config.headers = {};
  }

  const response = await api.post("/api/profile", data, config);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/api/profile/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const config = {};

  if (data instanceof FormData) {
    config.headers = {};
  }

  const response = await api.put("/api/profile", data, config);
  return response.data;
};