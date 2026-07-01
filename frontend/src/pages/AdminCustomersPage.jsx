import React, { useEffect, useState } from "react";
import { getAllCustomers, createCustomerAndUser } from "../api/admin";

const AdminCustomersPage = () => {
  const [users, setUsers] = useState([]);
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
      const res = await getAllCustomers();
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
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
      <h1>Admin – Alla användare</h1>

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

      <h2>Alla användare</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>E‑post</th>
            <th>Roll</th>
            <th>Kundnamn</th>
            <th>Customer ID</th>
            <th>Skapad</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.customer_name || "—"}</td>
              <td>{u.customer_id || "—"}</td>
              <td>{new Date(u.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminCustomersPage;
