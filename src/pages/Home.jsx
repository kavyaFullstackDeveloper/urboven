// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "../api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import "./Home.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const navigate = useNavigate();

  const loadPage = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const data = await fetchProperties({ q: query, page: p, pageSize: perPage });
      const newItems = Array.isArray(data) ? data : (data.results || []);
      const more = reset ? newItems : [...items, ...newItems];
      setItems(more);
      setHasNext(Array.isArray(data) ? newItems.length === perPage : Boolean(data.next));
      setPage(p + 1);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [query, page, items, loading]);

  function handleSearch() { setItems([]); setPage(1); setHasNext(true); loadPage(true); }

  useEffect(() => { loadPage(true); /* mount */ }, []); // eslint disabled intentionally

  useEffect(() => {
    const onScroll = () => {
      if (!hasNext || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) loadPage();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNext, loading, loadPage]);

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
            {items.map((p) => <PropertyCard key={p.id} prop={p} />)}
            {loading && <p>Loading…</p>}
            {!hasNext && !loading && <p>End of results.</p>}
          </div>

          <div className="sidebar">
            <div className="top-rated">
              <h2>🏆 Top Rated</h2>
              <div className="top-rated-cards">
                {items.slice(0, 3).map((p) => <PropertyCard key={p.id} prop={p} small />)}
              </div>
            </div>
            <div className="help-sidebar">
              <h3>Need Help?</h3>
              <form>
                <input placeholder="Name" /><input placeholder="Phone" /><input placeholder="Email" />
                <button>Submit</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
