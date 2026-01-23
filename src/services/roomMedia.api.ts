import apiClient from "./apiClient";

export const uploadRoomImages = async (roomId: string, files: File[]) => {
  const formData = new FormData();
  formData.append("roomId", roomId);
  files.forEach((file) => formData.append("images", file));

  return apiClient.post("/rooms/uploads", formData);
};

export const uploadRoomVideo = async (roomId: string, file: File) => {
  const formData = new FormData();
  formData.append("roomId", roomId);
  formData.append("video", file);

  return apiClient.post("/rooms/uploads/video", formData);
};

export const deleteRoomImage = (id: string) =>
  apiClient.delete(`/rooms/uploads/${id}`);

export const deleteRoomVideo = (id: string) =>
  apiClient.delete(`/rooms/uploads/video/${id}`);

export const getRoomImages = (roomId: string) =>
  apiClient.get(`/rooms/uploads/${roomId}`);

export const getRoomVideos = (roomId: string) =>
  apiClient.get(`/rooms/uploads/video/${roomId}`);
