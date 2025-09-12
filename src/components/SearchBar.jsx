import React from "react";
import "./SearchBar.css";

export default function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location in India..."
      />
      <button onClick={onSearch}>🔍</button>
    </div>
  );
}
