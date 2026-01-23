import apiClient from "./apiClient";

export const getRoomPricingById = (id: string) => {
  return apiClient.get(`/seat-pricing/${id}`);
};

export const getAllRoomPricing = () => {
  return apiClient.get("/seat-pricing");
};
