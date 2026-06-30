import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Visa sidebar endast för admin
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <aside className="admin-sidebar">
      <h3>Adminpanel</h3>

      <nav className="admin-nav">
        <Link to="/admin/customers" className="admin-link">
          🧑‍💼 Hantera Customers
        </Link>

        <Link to="/jobs" className="admin-link">
          📄 Hantera Jobbannonser
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
