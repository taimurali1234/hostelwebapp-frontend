import apiClient from "./apiClient";

export const getRoomPricingById = (id: string) => {
  return apiClient.get(`/api/seat-pricing/${id}`);
};

export const getAllRoomPricing = () => {
  return apiClient.get("/api/seat-pricing");
};
