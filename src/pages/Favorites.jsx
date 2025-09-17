// src/pages/Favorites.jsx
import { getFavorites } from "../utils/favorites";
import { isLoggedIn } from "../utils/auth";
import PropertyCard from "../components/PropertyCard";
import { useEffect, useState } from "react";
import { fetchProperty } from "../api";
import "./Favorites.css";

export default function Favorites() {
  const [favProps, setFavProps] = useState([]);

  useEffect(() => {
    const ids = getFavorites();
    if (ids.length === 0) return;
    Promise.all(ids.map(fetchProperty)).then(setFavProps).catch(console.error);
  }, []);

  return (
    <div className="favorites-page">
      <h2>Your Favorite Properties</h2>
      {favProps.length === 0 ? (
        <p>{isLoggedIn() ? "No favorites yet." : "Login to save favorites."}</p>
      ) : (
        favProps.map((p) => <PropertyCard key={p.id} prop={p} />)
      )}
    </div>
  );
}
