import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import "./PropertyCard.css";


export default function PropertyCard({ prop }) {
  const [idx, setIdx] = useState(0);
  const images = prop.images || [];
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  
  useEffect(() => {
    setFav(isFavorite(prop.id));
  }, [prop.id]);

 
  const handleFav = (e) => {
  e.stopPropagation();
  if (!isLoggedIn()) {
    alert("Please login to favorite properties!");
    return;
  }
  toggleFavorite(prop.id);
  setFav(!fav);
};

  return (
    <div className="property-card" onClick={() => navigate(`/detail/${prop.id}`)}>
       <div className="fav-icon" onClick={handleFav}>
        {fav ? "❤️" : "🤍"}
      </div>
      <div className="property-img">
        {images.length > 0 && (
          <img src={images[idx]} alt={prop.title} />
        )}
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="nav-btn left">‹</button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="nav-btn right">›</button>
          </>
        )}
      </div>

      <div className="property-info">
        <div className="days">{prop.days_ago} days ago</div>
        <h3>{prop.title}</h3>
        <p>{prop.bhk} • {prop.location}</p>
        <p className="price">₹{prop.price.toLocaleString()} {prop.is_villa ? "• Villa" : "• Flat"}</p>
        <p className="avg">Avg price: ₹{prop.avg_price.toLocaleString()}</p>
        <hr />
        <div className="seller">
          <span>Seller: {prop.seller_name}</span>
          <button>Contact</button>
        </div>
      </div>
    </div>
  );
}
