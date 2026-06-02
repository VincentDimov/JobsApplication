import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Candidate = {
  id: string;
  name: string;
  email: string | null;
  linkedin_url: string | null;
};

const CandidateJobsList: React.FC<{ candidateId: string }> = ({ candidateId }) => (
  <p className="text-sm text-slate-500">Jobb för kandidat {candidateId} kommer här.</p>
);

const NotesComponent: React.FC<{ candidateId: string }> = ({ candidateId }) => (
  <p className="text-sm text-slate-500">Anteckningar för kandidat {candidateId} kommer här.</p>
);


export const CandidateProfilePage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    apiFetch(`/candidates/${id}`, {}, token).then(setCandidate);
  }, [id]);

  if (!candidate) return <p>Laddar...</p>;

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold">{candidate.name}</h1>
        <p className="text-sm text-slate-600">{candidate.email}</p>

        {candidate.linkedin_url && (
          <a
            href={candidate.linkedin_url}
            target="_blank"
            className="text-blue-600 text-sm"
          >
            LinkedIn-profil
          </a>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Jobb kopplade till kandidaten</h2>
        <CandidateJobsList candidateId={candidate.id} />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Anteckningar</h2>
        <NotesComponent candidateId={candidate.id} />
      </div>
    </div>
  );
};
