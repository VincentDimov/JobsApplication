import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import candidateRoutes from "./routes/candidates.js";
import jobCandidateRoutes from "./routes/jobCandidates.js";
import adminRoutes from "./routes/admin.js";



const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route for Vercel health check
app.get("/api", (req, res) => {
  res.json({ message: "Backend running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/job-candidates", jobCandidateRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Fallback route (optional)
app.get("/", (req, res) => {
  res.json({ message: "Root route active" });
});

// ✅ Port configuration for Vercel
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

