import express from "express";
import {
  getJobCandidates,
  getJobCandidateById,
  createJobCandidate,
  updateJobCandidate,
  deleteJobCandidate
} from "../controllers/jobCandidatesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getJobCandidates);
router.get("/:id", authMiddleware, getJobCandidateById);
router.post("/", authMiddleware, createJobCandidate);
router.put("/:id", authMiddleware, updateJobCandidate);
router.delete("/:id", authMiddleware, deleteJobCandidate);

export default router;
