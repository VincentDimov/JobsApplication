import { supabase } from "../lib/supabaseAdmin.js";

// GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { customer_id, role } = req.user;

    let query = supabase.from("jobs").select("*");

    // Admin får se ALLA jobb
    if (role !== "admin") {
      query = query.eq("customer_id", customer_id);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    let query = supabase.from("jobs").select("*").eq("id", id).single();

    // Admin får se allt, andra får bara se sina egna
    if (role !== "admin") {
      query = supabase.from("jobs")
        .select("*")
        .eq("id", id)
        .eq("customer_id", customer_id)
        .single();
    }

    const { data, error } = await query;

    if (error || !data) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { customer_id } = req.user;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert([{ title, description, customer_id }])
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    res.json({ message: "Job created", job: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const { customer_id, role } = req.user;

    // Admin får uppdatera allt, andra bara sina egna
    let query = supabase.from("jobs").update({ title, description }).eq("id", id);

    if (role !== "admin") {
      query = query.eq("customer_id", customer_id);
    }

    const { data, error } = await query.select().single();

    if (error || !data) {
      return res.status(404).json({ error: "Job not found or not allowed" });
    }

    res.json({ message: "Job updated", job: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    let query = supabase.from("jobs").delete().eq("id", id);

    if (role !== "admin") {
      query = query.eq("customer_id", customer_id);
    }

    const { error } = await query;

    if (error) {
      return res.status(404).json({ error: "Job not found or not allowed" });
    }

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
