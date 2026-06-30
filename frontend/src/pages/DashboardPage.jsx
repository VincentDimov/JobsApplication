import React from "react";
import JobList from "../components/JobList.jsx";

const DashboardPage = () => {
  return (
    <section className="dashboard-page">
      <h1>Mitt konto</h1>
      <p>Här kan du se jobb kopplade till din kund.</p>
      <JobList />
    </section>
  );
};

export default DashboardPage;
