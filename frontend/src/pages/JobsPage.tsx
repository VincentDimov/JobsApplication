import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";

type Job = {
  id: string;
  title: string;
  description: string | null;
};

export const JobsPage: React.FC = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const data = await apiFetch("/jobs", {}, token);
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) loadJobs();
  }, [token]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch(
        "/jobs",
        {
          method: "POST",
          body: JSON.stringify({ title, description })
        },
        token
      );
      setTitle("");
      setDescription("");
      await loadJobs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Skapa jobb</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleCreateJob} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Titel</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fullstack Developer"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Beskrivning</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kort beskrivning av jobbet..."
            />
          </div>
          <button disabled={loading} className="btn">
            {loading ? "Skapar..." : "Skapa jobb"}
          </button>
        </form>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Mina jobb</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500">Inga jobb skapade ännu.</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {jobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">{job.title}</div>
                  <div className="text-sm text-slate-500">{job.description}</div>
                </div>
                <Link
                  to={`/jobs/${job.id}/kanban`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Öppna kanban
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
