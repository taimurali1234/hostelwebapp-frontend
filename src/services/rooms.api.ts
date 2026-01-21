// services/rooms.api.ts
import apiClient from "./apiClient";

export const getSingleRoom = (id: string) => {
  return apiClient.get(`/api/rooms/${id}`);
};
