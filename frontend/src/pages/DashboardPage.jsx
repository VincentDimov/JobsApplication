import React from "react";
import JobList from "../components/JobList.jsx";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate(); // ⭐ DU SAKNADE DENNA

  return (
    <section className="dashboard-page">
      <h1>Mitt konto</h1>

      <button
        className="btn-primary"
        onClick={() => navigate("/customer/create-job")}
      >
        Skapa ny annons
      </button>

      <p>Här kan du se jobb kopplade till din kund.</p>
      <JobList />
    </section>
  );
};

export default DashboardPage;
