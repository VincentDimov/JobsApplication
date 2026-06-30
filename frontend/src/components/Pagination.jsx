import React from "react";

const Pagination = ({ page, total, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    pages.push(p);
  }

  return (
    <div className="pagination">
      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
