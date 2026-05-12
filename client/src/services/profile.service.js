import api from "../api/axios";

export const createProfile = (data) => {
  return api.post("/profile", data);
};

export const getMyProfile = () => {
  return api.get("/profile/me");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
};