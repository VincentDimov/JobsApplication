import { supabase } from "../lib/supabaseAdmin.js";
import bcrypt from "bcrypt";

// POST /api/admin/create-customer-and-user
export const createCustomerAndUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { customer_name, user_email, user_password, user_role } = req.body;

    if (!customer_name || !user_email || !user_password || !user_role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Skapa kund
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert([{ name: customer_name }])
      .select()
      .single();

    if (customerError) return res.status(400).json({ error: customerError });

    // 2. Hasha lösenord
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // 3. Skapa användare i profiles kopplad till kunden
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .insert([
        {
          email: user_email,
          password: hashedPassword,
          role: user_role,
          customer_id: customer.id
        }
      ])
      .select()
      .single();

    if (userError) return res.status(400).json({ error: userError });

    res.json({
      message: "Customer and user created",
      customer,
      user
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// GET /api/admin/customers
export const getAllCustomers = async (req, res) => {
  try {
    const { role } = req.user;

    // Endast admin får se alla kunder
    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });

    res.json({
      count: data.length,
      customers: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/users/:customer_id
export const getUsersByCustomer = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id is required" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, customer_id, created_at")
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


// PUT /api/admin/customers/:customer_id
export const updateCustomerName = async (req, res) => {
  try {
    const { role } = req.user;

    // Endast admin får uppdatera kundinfo
    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { customer_id } = req.params;
    const { new_name } = req.body;

    if (!new_name) {
      return res.status(400).json({ error: "new_name is required" });
    }

    // Kontrollera att kunden finns
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customer_id)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Uppdatera kundens namn
    const { data, error } = await supabase
      .from("customers")
      .update({ name: new_name })
      .eq("id", customer_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({
      message: "Customer name updated",
      customer: data
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// PUT /api/admin/users/:user_id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { user_id } = req.params;
    const { new_role } = req.body;

    if (!new_role) {
      return res.status(400).json({ error: "new_role is required" });
    }

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



// DELETE /api/admin/users/:user_id
export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

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

