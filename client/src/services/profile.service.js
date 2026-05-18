import api from "../api/axios.js";

export const createProfile = async (data, token) => {
  const response = await api.post("/api/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMyProfile = async (token) => {
  const response = await api.get("/api/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProfile = async (data, token) => {
  const response = await api.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
