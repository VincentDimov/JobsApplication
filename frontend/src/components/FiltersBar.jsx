import React from "react";

const FiltersBar = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filters-bar">
      <input
        name="q"
        placeholder="Nyckelord"
        value={filters.q || ""}
        onChange={handleChange}
      />
      <input
        name="loc"
        placeholder="Ort"
        value={filters.loc || ""}
        onChange={handleChange}
      />
      <select
        name="sort"
        value={filters.sort || "newest"}
        onChange={handleChange}
      >
        <option value="newest">Senaste först</option>
        <option value="oldest">Äldsta först</option>
      </select>
      <select
        name="pageSize"
        value={filters.pageSize || 10}
        onChange={handleChange}
      >
        <option value={10}>10 per sida</option>
        <option value={20}>20 per sida</option>
        <option value={50}>50 per sida</option>
      </select>
    </div>
  );
};

export default FiltersBar;
