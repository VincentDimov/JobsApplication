import api from "./client";

export const getCandidates = () => api.get("/candidates");
export const getCandidateById = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (payload) => api.post("/candidates", payload);
export const updateCandidate = (id, payload) =>
  api.put(`/candidates/${id}`, payload);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
