import { supabase } from "../lib/supabaseAdmin.js";

// GET /api/candidates
export const getCandidates = async (req, res) => {
  try {
    const { customer_id, role } = req.user;

    let query = supabase.from("candidates").select("*");

    // Admin får se ALLA kandidater
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

// GET /api/candidates/:id
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    let query = supabase.from("candidates").select("*").eq("id", id).single();

    if (role !== "admin") {
      query = supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .eq("customer_id", customer_id)
        .single();
    }

    const { data, error } = await query;

    if (error || !data) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/candidates
export const createCandidate = async (req, res) => {
  try {
    const { name, email, linkedin_url } = req.body;
    const { customer_id } = req.user;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("candidates")
      .insert([
        {
          name,
          email,
          linkedin_url,
          customer_id
        }
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    res.json({ message: "Candidate created", candidate: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/candidates/:id
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, linkedin_url } = req.body;
    const { customer_id, role } = req.user;

    let query = supabase
      .from("candidates")
      .update({ name, email, linkedin_url })
      .eq("id", id);

    if (role !== "admin") {
      query = query.eq("customer_id", customer_id);
    }

    const { data, error } = await query.select().single();

    if (error || !data) {
      return res.status(404).json({ error: "Candidate not found or not allowed" });
    }

    res.json({ message: "Candidate updated", candidate: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/candidates/:id
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, role } = req.user;

    let query = supabase.from("candidates").delete().eq("id", id);

    if (role !== "admin") {
      query = query.eq("customer_id", customer_id);
    }

    const { error } = await query;

    if (error) {
      return res.status(404).json({ error: "Candidate not found or not allowed" });
    }

    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
