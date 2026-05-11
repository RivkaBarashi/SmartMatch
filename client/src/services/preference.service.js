import api from '../api/axios';

export const completeRegistration = (data) => {
  return api.post("/auth/register", data);
};

export const getPreferences = () => {
  return api.get("/preferences");
};

export const updatePreferences = (data) => {
  return api.put("/preferences", data);
};
