// src/components/PropertyCard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import "./PropertyCard.css";

export default function PropertyCard({ prop, small }) {
  const [idx, setIdx] = useState(0);
  const [fav, setFav] = useState(false);
  const images = prop.images || [];
  const navigate = useNavigate();

  useEffect(() => { setFav(isFavorite(prop.id)); }, [prop.id]);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const handleFav = (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) { alert("Please login to favorite properties!"); navigate("/auth"); return; }
    toggleFavorite(prop.id); setFav((v) => !v);
  };

  return (
    <div className={`property-card ${small ? "small" : ""}`} onClick={() => navigate(`/detail/${prop.id}`)}>
      <div className="fav-icon" onClick={handleFav}>{fav ? "❤️" : "🤍"}</div>
      <div className="property-img">
        {images.length > 0 && <img src={images[idx]} alt={prop.title} />}
        {images.length > 1 && (
          <>
            <button className="nav-btn left" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
            <button className="nav-btn right" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          </>
        )}
      </div>
      <div className="property-info">
        <div className="days">{prop.days_ago} days ago</div>
        <h3>{prop.title}</h3>
        <p>{prop.bhk} • {prop.location}</p>
        <p className="price">₹{Number(prop.price).toLocaleString()} {prop.is_villa ? "• Villa" : "• Flat"}</p>
        <p className="avg">Avg price: ₹{Number(prop.avg_price).toLocaleString()}</p>
        <hr />
        <div className="seller"><span>Seller: {prop.seller_name}</span><button>Contact</button></div>
      </div>
    </div>
  );
}
