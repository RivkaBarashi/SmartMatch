import api from "../api/axios.js";

export const sendInterest = async (receiverId) => {
  const response = await api.post("/api/interests", { receiverId });
  return response.data;
};

export const getIncomingInterests = async () => {
  const response = await api.get("/api/interests/incoming");
  return response.data;
};

export const getOutgoingInterests = async () => {
  const response = await api.get("/api/interests/outgoing");
  return response.data;
};

export const acceptInterest = async (interestId) => {
  const response = await api.patch(`/api/interests/${interestId}/accept`);
  return response.data;
};

export const rejectInterest = async (interestId) => {
  const response = await api.patch(`/api/interests/${interestId}/reject`);
  return response.data;
};

export const sendToManager = async (otherUserId) => {
  const response = await api.patch(
    `/api/interests/send-to-manager/${otherUserId}`
  );
  return response.data;
};