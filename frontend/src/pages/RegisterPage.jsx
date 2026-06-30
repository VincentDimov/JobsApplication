import React, { useState } from "react";
import { register } from "../api/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer_user");
  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await register({
        email,
        password,
        role,
        customer_id: customerId || null,
      });
      setMessage("Användare skapad.");
    } catch (err) {
      setError("Kunde inte skapa användare.");
    }
  };

  return (
    <section className="auth-page">
      <h1>Skapa konto</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          E‑post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Roll
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer_user">Kund‑användare</option>
            <option value="customer_admin">Kund‑admin</option>
            <option value="admin">Superadmin</option>
          </select>
        </label>
        <label>
          Customer ID (valfritt)
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" className="btn-primary">
          Registrera
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;
