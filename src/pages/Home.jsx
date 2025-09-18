import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "../api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import "./Home.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [rawItems, setRawItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const navigate = useNavigate();

  // Apply client-side filtering and sorting on the page data we have
  const items = useMemo(() => {
    let out = rawItems;

    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((x) =>
        (x.location || "").toLowerCase().includes(q) ||
        (x.title || "").toLowerCase().includes(q)
      );
    }
    if (filters.minPrice != null) out = out.filter((x) => Number(x.price) >= Number(filters.minPrice));
    if (filters.maxPrice != null) out = out.filter((x) => Number(x.price) <= Number(filters.maxPrice));
    if (filters.bhk != null) out = out.filter((x) => Number(x.bedrooms || 0) === Number(filters.bhk));

    switch (filters.sort) {
      case "price_asc": out = [...out].sort((a,b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": out = [...out].sort((a,b) => Number(b.price) - Number(a.price)); break;
      case "title_asc": out = [...out].sort((a,b) => (a.title||"").localeCompare(b.title||"")); break;
      case "title_desc": out = [...out].sort((a,b) => (b.title||"").localeCompare(a.title||"")); break;
      default: break; // relevance (leave order)
    }
    return out;
  }, [rawItems, query, filters]);

  const loadPage = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const data = await fetchProperties({ q: "", page: p, pageSize: perPage }); // server fetch no filter; client filters below
      const newItems = Array.isArray(data) ? data : (data.results || []);
      setRawItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasNext(Array.isArray(data) ? newItems.length === perPage : Boolean(data.next));
      setPage(p + 1);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [page, loading]);

  const handleSearch = (cleared = false) => {
    // Start a new search — reset fetched pages and load first page
    setRawItems([]);
    setPage(1);
    setHasNext(true);
    loadPage(true);
  };

  useEffect(() => { loadPage(true); }, []); // initial fetch

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
            <SearchBar
              query={query}
              setQuery={setQuery}
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
            />
          </div>
        </section>

        <section className="content">
          <div className="cards">
            <div className="result-head">
              <h2>Search Results</h2>
              <span className="muted">{items.length} properties</span>
            </div>

            {items.map((p) => <PropertyCard key={p.id} prop={p} />)}
            {loading && <p>Loading…</p>}
            {!hasNext && !loading && rawItems.length === 0 && <p>No properties found.</p>}
            {!hasNext && !loading && rawItems.length > 0 && <p>End of results.</p>}
          </div>

          <aside className="sidebar">
            <div className="promo">
              <h2>Sponsored</h2>
              <div className="promo-grid">
                <a className="promo-tile" href="#" aria-label="Ad 1">
                  <img src="https://picsum.photos/300/180?1" alt="Ad" />
                  <div className="promo-caption">Zero Brokerage Deals</div>
                </a>
                <a className="promo-tile" href="#" aria-label="Ad 2">
                  <img src="https://picsum.photos/300/180?2" alt="Ad" />
                  <div className="promo-caption">Home Loans @ 8.5%</div>
                </a>
                <a className="promo-tile" href="#" aria-label="Ad 3">
                  <img src="https://picsum.photos/300/180?3" alt="Ad" />
                  <div className="promo-caption">Interior Design Offers</div>
                </a>
              </div>
            </div>

            <div className="help-sidebar">
              <h3>Need Help?</h3>
              <form onSubmit={(e)=>e.preventDefault()}>
                <input placeholder="Name" />
                <input placeholder="Phone" />
                <input placeholder="Email" />
                <button>Submit</button>
              </form>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
