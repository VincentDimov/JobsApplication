import { supabase } from "../lib/supabaseAdmin.js";
import bcrypt from "bcrypt";

/* -------------------------------------------------------
   POST /api/admin/create-customer-and-user
   Skapar en "customer" (egentligen bara ett namn) + user i profiles
-------------------------------------------------------- */
export const createCustomerAndUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const { customer_name, user_email, user_password, user_role } = req.body;

    if (!customer_name || !user_email || !user_password || !user_role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hasha lösenord
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Skapa user i profiles
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .insert([
        {
          email: user_email,
          password: hashedPassword,
          role: user_role,
          costumerName: customer_name,
          customer_id: customer_name // <-- customer_name används som ID
        }
      ])
      .select()
      .single();

    if (userError) return res.status(400).json({ error: userError });

    res.json({
      message: "Customer and user created",
      user
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------
   GET /api/admin/customers
   Hämtar ALLA users från profiles (ingen grouping)
-------------------------------------------------------- */
export const getAllCustomers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    // Hämta ALLA users från profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, customer_id, costumerName, created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });

    res.json({
      count: data.length,
      users: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


/* -------------------------------------------------------
   GET /api/admin/users/:customer_id
   Hämtar alla users för en specifik customer_id
-------------------------------------------------------- */
export const getUsersByCustomer = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const { customer_id } = req.params;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, customer_id, costumerName, created_at")
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });

    res.json({
      customer_id,
      count: data.length,
      users: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------
   PUT /api/admin/customers/:customer_id
   Uppdaterar customer_name för alla users med samma customer_id
-------------------------------------------------------- */
export const updateCustomerName = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const { customer_id } = req.params;
    const { new_name } = req.body;

    if (!new_name) {
      return res.status(400).json({ error: "new_name is required" });
    }

    // Uppdatera alla users med samma customer_id
    const { data, error } = await supabase
      .from("profiles")
      .update({ costumerName: new_name, customer_id: new_name })
      .eq("customer_id", customer_id)
      .select();

    if (error) return res.status(400).json({ error });

    res.json({
      message: "Customer name updated",
      updated_users: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------
   PUT /api/admin/users/:user_id/role
   Uppdaterar en users roll
-------------------------------------------------------- */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const { user_id } = req.params;
    const { new_role } = req.body;

    const allowedRoles = ["admin", "customer_admin", "customer_user"];
    if (!allowedRoles.includes(new_role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: new_role })
      .eq("id", user_id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User role updated",
      user: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------
   DELETE /api/admin/users/:user_id
   Tar bort en user
-------------------------------------------------------- */
export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Not allowed" });

    const { user_id } = req.params;

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user_id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError });
    }

    res.json({
      message: "User deleted",
      deleted_user_id: user_id
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
