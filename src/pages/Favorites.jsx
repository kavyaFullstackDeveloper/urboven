import { getFavorites } from "../utils/favorites";
import { getProperties } from "../api";  
import PropertyCard from "../components/PropertyCard";
import "./Favorites.css";

export default function Favorites() {
  const favIds = getFavorites();
  const all = getProperties();   
  const favProps = all.filter((p) => favIds.includes(p.id));

  return (
    <div className="favorites-page">
      <h2>Your Favorite Properties</h2>
      {favProps.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favProps.map((p) => <PropertyCard key={p.id} prop={p} />)
      )}
    </div>
  );
}
