import api from "../api/axios.js";

export const getMatches = async () => {
  const response = await api.get("/api/match");
  return response.data;
};