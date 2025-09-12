import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProperties } from "../api";
import { getProperties } from "../api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import "./Home.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(searchProperties(""));
  const navigate = useNavigate();

  function handleSearch() {
    const filtered = searchProperties(query);
    setResults(filtered);
  }

  return (
    <div>
     <nav className="navbar">
  <div className="logo" onClick={() => navigate("/")}>🏠 Urbo Ventures</div>
  <div className="menu">
    <button onClick={() => navigate("/auth")}>Login/Signup</button>
    <button onClick={() => navigate("/favorites")}>Favorites</button>
  </div>
</nav>

<main className="home">
  <section className="hero">
    <div className="hero-overlay">
      <h1>Find Your Dream Home</h1>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
    </div>
  </section>

  <section className="content">
    <div className="cards">
      <h2>Search Results</h2>
      {results.map((p) => (
        <PropertyCard key={p.id} prop={p} />
      ))}
    </div>

    
    <div className="sidebar">
      <div className="top-rated">
        <h2>🏆 Top Rated</h2>
        <div className="top-rated-cards">
          {results.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} prop={p} small />
          ))}
        </div>
      </div>

      <div className="help-sidebar">
        <h3>Need Help?</h3>
        <form>
          <input placeholder="Name" />
          <input placeholder="Phone" />
          <input placeholder="Email" />
          <button>Submit</button>
        </form>
      </div>
    </div>
  </section>
</main>



    </div>
  );
}
