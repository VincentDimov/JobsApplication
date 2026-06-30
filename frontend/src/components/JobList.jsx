import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPublicJobs, getJobs } from "../api/jobs";
import JobCard from "./JobCard";
import FiltersBar from "./FiltersBar";
import Pagination from "./Pagination";

const JobList = ({ publicOnly = false }) => {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    loc: "",
    sort: "newest",
    pageSize: 10,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = publicOnly ? await getPublicJobs() : await getJobs();
        setJobs(res.data);
      } catch (err) {
        setError("Kunde inte hämta jobb.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [publicOnly]);

  useEffect(() => {
    let data = [...jobs];

    if (filters.q) {
      const term = filters.q.toLowerCase();
      data = data.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term)
      );
    }

    if (filters.loc) {
      const term = filters.loc.toLowerCase();
      data = data.filter((job) =>
        job.description?.toLowerCase().includes(term)
      );
    }

    if (filters.sort === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      data.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    setFiltered(data);
    setPage(1);
  }, [jobs, filters]);

  const pageSize = Number(filters.pageSize) || 10;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  if (loading) return <p>Laddar jobb...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <FiltersBar filters={filters} onChange={setFilters} />
      {pageItems.length === 0 ? (
        <p>Inga jobb hittades.</p>
      ) : (
        <>
          <div className="job-list">
            {pageItems.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination
            page={page}
            total={filtered.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </>
      )}
    </>
  );
};

export default JobList;
