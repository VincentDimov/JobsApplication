import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../api/jobs";
import {
  getJobCandidates,
  addJobCandidate,
  updateJobCandidateStage,
  deleteJobCandidate,
} from "../api/jobCandidates";

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [stageUpdate, setStageUpdate] = useState({});
  const [newCandidateId, setNewCandidateId] = useState("");

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError("Jobb hittades inte eller du har inte behörighet.");
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await getJobCandidates(id, search);
      setCandidates(res.data);
    } catch (err) {
      // ignorera tyst
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    fetchCandidates();
  }, [id, search]);

  const handleStageChange = (jcId, value) => {
    setStageUpdate({ ...stageUpdate, [jcId]: value });
  };

  const handleStageSave = async (jcId) => {
    const stage = stageUpdate[jcId];
    if (!stage) return;
    await updateJobCandidateStage(jcId, stage);
    fetchCandidates();
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateId) return;
    await addJobCandidate({ job_id: id, candidate_id: Number(newCandidateId) });
    setNewCandidateId("");
    fetchCandidates();
  };

  const handleDeleteCandidate = async (jcId) => {
    await deleteJobCandidate(jcId);
    fetchCandidates();
  };

  if (error) return <p>{error}</p>;
  if (!job) return <p>Laddar...</p>;

  return (
    <article className="job-detail">
      <h1>{job.title}</h1>
      <p>Kund #{job.customer_id}</p>
      <pre className="job-description-full">{job.description}</pre>

      <section className="job-candidates-section">
        <h2>Kandidater till detta jobb</h2>

        <div className="filters-bar">
          <input
            placeholder="Sök kandidat (namn eller e‑post)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form onSubmit={handleAddCandidate} className="admin-form">
          <input
            placeholder="Candidate ID"
            value={newCandidateId}
            onChange={(e) => setNewCandidateId(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Lägg till kandidat
          </button>
        </form>

        {candidates.length === 0 ? (
          <p>Inga kandidater kopplade.</p>
        ) : (
          <ul>
            {candidates.map((jc) => (
              <li key={jc.id}>
                <strong>{jc.candidates?.name}</strong>{" "}
                ({jc.candidates?.email}) – stage:{" "}
                <select
                  value={stageUpdate[jc.id] ?? jc.stage}
                  onChange={(e) => handleStageChange(jc.id, e.target.value)}
                >
                  <option value="new">Ny</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Intervju</option>
                  <option value="offer">Erbjudande</option>
                  <option value="rejected">Avslag</option>
                </select>
                <button onClick={() => handleStageSave(jc.id)}>
                  Spara
                </button>
                <button onClick={() => handleDeleteCandidate(jc.id)}>
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
};

export default JobDetailPage;
