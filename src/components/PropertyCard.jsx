import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import "./PropertyCard.css";

// Import API_BASE to construct the full image URL
import { API_BASE } from "../api"; // Assuming API_BASE is exported from api.js

export default function PropertyCard({ prop, small }) {
  const [fav, setFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setFav(isFavorite(prop.id)); }, [prop.id]);

  const handleFav = (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) { alert("Please login to favorite properties!"); navigate("/auth"); return; }
    toggleFavorite(prop.id); setFav((v) => !v);
  };

  // Construct the full image URL
  // Django sends a relative URL like /media/property_images/image.jpg
  // We need to prepend the API_BASE to make it an absolute URL for the frontend
  const imageUrl = prop.image ? `${API_BASE}${prop.image}` : '';

  return (
    <div className={`property-card ${small ? "small" : ""}`} onClick={() => navigate(`/detail/${prop.id}`)}>
      <div className="fav-icon" onClick={handleFav}>{fav ? "❤️" : "🤍"}</div>
      <div className="property-img">
        {/* Display the single image if imageUrl exists */}
        {imageUrl && <img src={imageUrl} alt={prop.title} />}
        {/* Removed image navigation buttons as there's only one image per property */}
      </div>
      <div className="property-info">
        <div className="days">{prop.days_ago} days ago</div>
        <h3>{prop.title}</h3>
        <p>{prop.bedrooms} BHK • {prop.location}</p> {/* Changed prop.bhk to prop.bedrooms */}
        <p className="price">₹{Number(prop.price).toLocaleString()} {prop.is_villa ? "• Villa" : "• Flat"}</p>
        <p className="avg">Avg price: ₹{Number(prop.avg_price).toLocaleString()}</p>
        <hr />
        <div className="seller"><span>Seller: {prop.seller_name}</span><button>Contact</button></div>
      </div>
    </div>
  );
}