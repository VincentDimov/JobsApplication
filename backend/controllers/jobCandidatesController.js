import { supabase } from "../lib/supabaseAdmin.js";

// GET /api/job-candidates?job_id=xxx&search=anna
export const getJobCandidates = async (req, res) => {
  try {
    const { job_id, search } = req.query;
    const { customer_id, role } = req.user;

    if (!job_id) {
      return res.status(400).json({ error: "job_id is required" });
    }

    let query = supabase
      .from("job_candidates")
      .select("*, candidates(*), jobs(*)")
      .eq("job_id", job_id);

    if (role !== "admin") {
      query = query.eq("jobs.customer_id", customer_id);
    }

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      query = query.or(
        `candidates.name.ilike.${term},candidates.email.ilike.${term}`
      );
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// GET /api/job-candidates/:id
export const getJobCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    let query = supabase
      .from("job_candidates")
      .select("*, candidates(*), jobs(*)")
      .eq("id", id)
      .single();

    if (role !== "admin") {
      query = query.eq("jobs.customer_id", customer_id);
    }

    const { data, error } = await query;

    if (error || !data) {
      return res.status(404).json({ error: "Job-candidate not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/job-candidates
export const createJobCandidate = async (req, res) => {
  try {
    const { job_id, candidate_id, stage } = req.body;
    const { customer_id, role } = req.user;

    if (!job_id || !candidate_id) {
      return res.status(400).json({ error: "job_id and candidate_id are required" });
    }

    // Kontrollera att jobbet tillhör kunden (om inte admin)
    let jobCheck = supabase.from("jobs").select("*").eq("id", job_id).single();
    if (role !== "admin") {
      jobCheck = jobCheck.eq("customer_id", customer_id);
    }

    const { data: jobData, error: jobError } = await jobCheck;
    if (jobError || !jobData) {
      return res.status(403).json({ error: "Not allowed to add candidate to this job" });
    }

    const { data, error } = await supabase
      .from("job_candidates")
      .insert([
        {
          job_id,
          candidate_id,
          stage: stage || "new"
        }
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    res.json({ message: "Candidate added to job", jobCandidate: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/job-candidates/:id
export const updateJobCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const { customer_id, role } = req.user;

    if (!stage) {
      return res.status(400).json({ error: "stage is required" });
    }

    // 1. Hämta job_candidate + job
    const { data: jc, error: jcError } = await supabase
      .from("job_candidates")
      .select("id, job_id, jobs(customer_id)")
      .eq("id", id)
      .single();

    if (jcError || !jc) {
      return res.status(404).json({ error: "Job-candidate not found" });
    }

    // 2. Om inte admin, kontrollera ägarskap
    if (role !== "admin" && jc.jobs?.customer_id !== customer_id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // 3. Uppdatera stage
    const { data, error } = await supabase
      .from("job_candidates")
      .update({ stage })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(400).json({ error: "Could not update job-candidate" });
    }

    res.json({ message: "Stage updated", jobCandidate: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// DELETE /api/job-candidates/:id
export const deleteJobCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    // 1. Hämta job_candidate + job
    const { data: jc, error: jcError } = await supabase
      .from("job_candidates")
      .select("id, job_id, jobs(customer_id)")
      .eq("id", id)
      .single();

    if (jcError || !jc) {
      return res.status(404).json({ error: "Job-candidate not found" });
    }

    // 2. Om inte admin, kontrollera ägarskap
    if (role !== "admin" && jc.jobs?.customer_id !== customer_id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // 3. Radera
    const { error: deleteError } = await supabase
      .from("job_candidates")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError });
    }

    res.json({ message: "Job-candidate removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
