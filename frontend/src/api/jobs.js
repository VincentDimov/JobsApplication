import api from "./client";

export const getPublicJobs = () => api.get("/jobs/public");
export const getJobs = () => api.get("/jobs");
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (payload) => api.post("/jobs", payload);
export const updateJob = (id, payload) => api.put(`/jobs/${id}`, payload);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
