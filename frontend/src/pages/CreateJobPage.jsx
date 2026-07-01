import React, { useState } from "react";
import { createJob } from "../api/jobs";
import { useNavigate } from "react-router-dom";

const CreateJobPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await createJob({ title, description });
      setMessage("Annons skapad!");
      navigate("/dashboard");
    } catch (err) {
      setError("Kunde inte skapa annons.");
    }
  };

  return (
    <section className="page">
      <h1>Skapa ny annons</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary">Skapa annons</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default CreateJobPage;
