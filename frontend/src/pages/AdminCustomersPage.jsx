import React, { useEffect, useState } from "react";
import { getAllUsers, createCustomerAndUser } from "../api/admin";

const AdminCustomersPage = () => {
  const [users, setUsers] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    user_email: "",
    user_password: "",
    user_role: "customer_admin",
  });

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);

      // Gruppera users efter customer_id
      const groups = {};
      res.data.users.forEach((u) => {
        const cid = u.customer_id || "none";
        if (!groups[cid]) groups[cid] = [];
        groups[cid].push(u);
      });

      setGrouped(groups);

    } catch (err) {
      setError("Kunde inte hämta användare. Är du inloggad som admin?");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await createCustomerAndUser(form);
      setMessage("Ny kund + användare skapad!");
      setForm({
        customer_name: "",
        user_email: "",
        user_password: "",
        user_role: "customer_admin",
      });
      fetchUsers();
    } catch (err) {
      setError("Kunde inte skapa kund/användare.");
    }
  };

  return (
    <section className="admin-page">
      <h1>Admin – Customers (Profiles)</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="customer_name"
          placeholder="Kundnamn"
          value={form.customer_name}
          onChange={handleChange}
        />
        <input
          name="user_email"
          placeholder="Admin‑e‑post"
          value={form.user_email}
          onChange={handleChange}
        />
        <input
          name="user_password"
          type="password"
          placeholder="Lösenord"
          value={form.user_password}
          onChange={handleChange}
        />
        <select
          name="user_role"
          value={form.user_role}
          onChange={handleChange}
        >
          <option value="customer_admin">Kund‑admin</option>
          <option value="customer_user">Kund‑användare</option>
        </select>

        <button type="submit" className="btn-primary">
          Skapa kund + användare
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h2>Alla customers (grupperat från profiles)</h2>

      <ul className="customer-list">
        {Object.keys(grouped).map((cid) => (
          <li key={cid}>
            <strong>Kund ID: {cid}</strong>

            <ul>
              {grouped[cid].map((u) => (
                <li key={u.id}>
                  {u.email} – {u.role}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminCustomersPage;
