import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchHero = () => {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (what) params.append("q", what);
    if (where) params.append("loc", where);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="hero">
      <h1>Hitta ditt nästa jobb</h1>
      <form className="hero-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Vad</label>
          <input
            type="text"
            placeholder="Jobbtitel, nyckelord eller företag"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Var</label>
          <input
            type="text"
            placeholder="Ort"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          Sök jobb
        </button>
      </form>

      <div className="popular-searches">
        <span>Populära sökningar:</span>
        <button onClick={() => navigate("/jobs?q=Frontend")}>Frontend</button>
        <button onClick={() => navigate("/jobs?q=Backend")}>Backend</button>
        <button onClick={() => navigate("/jobs?q=Fullstack")}>Fullstack</button>
      </div>
    </section>
  );
};

export default SearchHero;
