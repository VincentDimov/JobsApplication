import api from "./client";

export const getJobCandidates = (jobId, search) =>
  api.get("/job-candidates", {
    params: { job_id: jobId, search },
  });

export const addJobCandidate = (payload) =>
  api.post("/job-candidates", payload);

export const updateJobCandidateStage = (id, stage) =>
  api.put(`/job-candidates/${id}`, { stage });

export const deleteJobCandidate = (id) =>
  api.delete(`/job-candidates/${id}`);
