import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { DropResult } from "@hello-pangea/dnd";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";
import { KanbanBoard } from "../components/KanbanBoard";

type Stage = "new" | "screening" | "interview" | "offer" | "rejected";

type JobCandidateFromApi = {
  id: string;
  stage: string;
  candidates: {
    id: string;
    name: string;
    email: string | null;
    linkedin_url: string | null;
  };
};

type CandidateCard = {
  id: string;
  stage: Stage;
  candidates: {
    id: string;
    name: string;
    email: string | null;
    linkedin_url: string | null;
  };
};

export const KanbanPage = () => {
  const { jobId } = useParams();
  const { token } = useAuth();

  const [items, setItems] = useState<CandidateCard[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!jobId || !token) return;
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams();
      qs.set("job_id", jobId);
      if (search.trim()) qs.set("search", search.trim());

      const data: JobCandidateFromApi[] = await apiFetch(
        `/job-candidates?${qs.toString()}`,
        {},
        token
      );

      const normalized: CandidateCard[] = data.map((jc) => ({
        id: jc.id,
        stage: (jc.stage || "new") as Stage,
        candidates: jc.candidates
      }));

      setItems(normalized);
    } catch (err: any) {
      setError(err.message || "Kunde inte ladda kandidater");
    } finally {
      setLoading(false);
    }
  }, [jobId, token, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const jobCandidateId = result.draggableId;
    const newStage = result.destination.droppableId as Stage;

    try {
      await apiFetch(
        `/job-candidates/${jobCandidateId}`,
        {
          method: "PUT",
          body: JSON.stringify({ stage: newStage })
        },
        token
      );
      // Optimistisk uppdatering lokalt
      setItems((prev) =>
        prev.map((item) =>
          String(item.id) === String(jobCandidateId)
            ? { ...item, stage: newStage }
            : item
        )
      );
    } catch (err) {
      // fallback: ladda om från servern
      load();
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Kanban för jobb</h1>
          <p className="text-xs text-slate-500">
            Dra och släpp kandidater mellan kolumner för att ändra stage.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            className="border rounded px-3 py-1 text-sm"
            placeholder="Filtrera på namn / e-post"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-slate-900 text-white px-3 py-1 rounded text-sm">
            Filtrera
          </button>
        </form>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Laddar kandidater...</p>
      ) : (
        <KanbanBoard items={items} onDragEnd={onDragEnd} />
      )}
    </div>
  );
};
