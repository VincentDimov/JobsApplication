import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabaseAdmin.js";

// REGISTER
export const register = async (req, res) => {
  const { email, password, role, customer_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const { data, error } = await supabase
    .from("profiles")
    .insert([{ email, password: hashed, role, customer_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error });

  res.json({ message: "User created", user: data });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Hämta användaren
  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // 2. Jämför lösenord
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // 3. Skapa JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      customer_id: user.customer_id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 4. Returnera token + user info
  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      role: user.role,
      customer_id: user.customer_id
    }
  });
};
