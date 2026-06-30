import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from "../controllers/jobsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { supabase } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);
router.post("/", authMiddleware, createJob);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);




export default router;
