import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <article className="job-card">
      <header>
        <h3>
          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        <p className="job-company">{job.customer_id}</p>
        <p className="job-location">{job.customer_name}</p>
      </header>
      {job.description && (
        <p className="job-description">
          {job.description.length > 160
            ? job.description.slice(0, 160) + "..."
            : job.description}
        </p>
      )}
      <div className="job-meta">
        <span>Publicerad: {new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </article>
  );
};

export default JobCard;
