import React from "react";
import "./SearchBar.css";

export default function SearchBar({
  query, setQuery,
  filters, setFilters,
  onSearch
}) {
  const set = (k, v) => setFilters({ ...filters, [k]: v });

  return (
    <div className="hero-search">
      <div className="search-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city/state, e.g. Bengaluru, Maharashtra"
          aria-label="Search location"
        />
        <button onClick={onSearch} aria-label="Search">🔍</button>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Min ₹</label>
          <input
            type="number"
            min="0"
            step="100000"
            value={filters.minPrice ?? ""}
            onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
          />
        </div>
        <div className="filter-group">
          <label>Max ₹</label>
          <input
            type="number"
            min="0"
            step="100000"
            value={filters.maxPrice ?? ""}
            onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="3,00,00,000"
          />
        </div>
        <div className="filter-group">
          <label>BHK</label>
          <select
            value={filters.bhk ?? ""}
            onChange={(e) => set("bhk", e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort</label>
          <select
            value={filters.sort ?? "relevance"}
            onChange={(e) => set("sort", e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
          </select>
        </div>
        <button className="clear-btn" onClick={() => { setQuery(""); setFilters({}); onSearch(true); }}>
          Clear
        </button>
      </div>
    </div>
  );
}
