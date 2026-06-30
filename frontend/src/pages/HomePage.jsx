import React from "react";
import SearchHero from "../components/SearchHero.jsx";
import JobList from "../components/JobList.jsx";

const HomePage = () => {
  return (
    <>
      <SearchHero />
      <section className="home-jobs">
        <h2>Senaste jobbannonser</h2>
        <JobList publicOnly />
      </section>
    </>
  );
};

export default HomePage;
