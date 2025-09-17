// src/pages/Detail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProperty } from "../api";
import "./Detail.css";
import { toggleFavorite, isFavorite } from "../utils/favorites";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [idx, setIdx] = useState(0);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchProperty(id).then((data) => {
      if (!ignore) {
        setProperty(data);
        setFav(isFavorite(data.id));
      }
    }).catch(console.error);
    return () => { ignore = true; };
  }, [id]);

  if (!property) return <p>Loading…</p>;

  const handleFav = () => {
    toggleFavorite(property.id);
    setFav(!fav);
  };

  const next = () => setIdx((i) => (i + 1) % (property.detail_images?.length || 1));
  const prev = () => setIdx((i) => (i - 1 + (property.detail_images?.length || 1)) % (property.detail_images?.length || 1));

  return (
    <div className="detail">
      <button onClick={() => navigate(-1)} className="back">← Back</button>
      <h2>{property.title}</h2>
      <p>{property.bhk} • {property.location}</p>

      <div className="hero-carousel">
        {property.detail_images?.length ? (
          <>
            <img src={property.detail_images[idx]} alt={property.title} />
            <button className="left" onClick={prev}>‹</button>
            <button className="right" onClick={next}>›</button>
          </>
        ) : null}
      </div>

      <div className="detail-icons">
        <span onClick={handleFav}>{fav ? "❤️" : "🤍"}</span>
        <span onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}>🔗</span>
      </div>

      <div className="detail-content">
        <h2>{property.title}</h2>
        <p>{property.bhk} • {property.location}</p>
        <p className="price">₹{Number(property.price).toLocaleString()} {property.is_villa ? "Villa" : "Flat"}</p>

        <h3>Description</h3>
        <p>{property.description}</p>

        <h3>Gallery</h3>
        <div className="gallery">
          {property.detail_images?.map((img, i) => <img key={i} src={img} alt="gallery" />)}
        </div>

        <h3>Seller Info</h3>
        <div className="contact-card">
          <p><b>{property.seller_name}</b></p>
          <p>📞 {property.seller_contact}</p>
        </div>

        <div className="help-form">
          <h3>Help me with this property</h3>
          <form>
            <input placeholder="Name" />
            <input placeholder="Phone" />
            <input placeholder="Email" />
            <button>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
