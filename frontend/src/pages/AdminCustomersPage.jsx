import React, { useEffect, useState } from "react";
import { getCustomers, createCustomerAndUser } from "../api/admin";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    user_email: "",
    user_password: "",
    user_role: "customer_admin",
  });

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data.customers);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCustomerAndUser(form);
    setForm({
      customer_name: "",
      user_email: "",
      user_password: "",
      user_role: "customer_admin",
    });
    fetchCustomers();
  };

  return (
    <section className="admin-page">
      <h1>Admin – Kunder</h1>
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

      <ul className="customer-list">
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} (id: {c.id})
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminCustomersPage;
