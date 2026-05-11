import api from "../api/axios";

export const updateProfile = (data) => {
  return api.put("/profile/update", data);
};