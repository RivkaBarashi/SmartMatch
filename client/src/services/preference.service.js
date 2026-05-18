import api from "../api/axios.js";

export const createPreferences = async (data, token) => {
  const response = await api.post("/api/preference", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMyPreferences = async (token) => {
  const response = await api.get("/api/preference/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePreferences = async (data, token) => {
  const response = await api.put("/api/preference", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
