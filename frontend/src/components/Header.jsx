import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="logo-dot">Job</span>App
        </Link>
        <Link to="/" className="nav-link">Alla Annonser</Link>
        <Link to="/jobs" className="nav-link">Dina Annonser</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>

        {/* ADMIN-KNAPPAR VISAS DIREKT */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/customers" className="nav-link">
              Admin Customers
            </Link>

            <Link to="/jobs" className="nav-link">
              Admin Jobbannonser
            </Link>
          </>
        )}
        
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="user-label">
              {user.role} 
            </span>
            <button onClick={handleLogout} className="btn-outline">
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Logga in</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
