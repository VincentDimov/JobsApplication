import express from "express";
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidatesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCandidates);
router.get("/:id", authMiddleware, getCandidateById);
router.post("/", authMiddleware, createCandidate);
router.put("/:id", authMiddleware, updateCandidate);
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;
