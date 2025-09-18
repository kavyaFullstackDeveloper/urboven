// src/pages/Detail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProperty } from "../api";
import "./Detail.css";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import { API_BASE } from "../api";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [idx, setIdx] = useState(0);
  const [fav, setFav] = useState(false);
  
const seededPics = (id, count = 5) =>
  Array.from({ length: count }, (_, k) => {
    const pic = (Number(id) * 37 + 11 + k * 17) % 300; // stable per id
    return `https://picsum.photos/id/${pic}/800/500`;
  });

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

 const gallery =
  Array.isArray(property.detail_images) && property.detail_images.length
    ? property.detail_images
    : property.image_url
    ? [property.image_url]
    : seededPics(property.id, 5);

const next = () => setIdx((i) => (i + 1) % (gallery.length || 1));
const prev = () => setIdx((i) => (i - 1 + (gallery.length || 1)) % (gallery.length || 1));

  return (
    <div className="detail">
      <button onClick={() => navigate(-1)} className="back">← Back</button>
      <h2>{property.title}</h2>
      <p>{property.bedrooms} BHK • {property.location}</p>

      <div className="hero-carousel">
        {gallery.length ? (
          <>
           <img
  src={gallery[idx]}
  alt={property.title}
  onError={(e) => {
    const seeds = seededPics(property.id, 5);
    e.currentTarget.src = seeds[idx % seeds.length];
  }}
/>
            {gallery.length > 1 && <>
              <button className="left" onClick={prev}>‹</button>
              <button className="right" onClick={next}>›</button>
            </>}
          </>
        ) : null}
      </div>

      <div className="detail-icons">
        <span onClick={handleFav}>{fav ? "❤️" : "🤍"}</span>
        <span onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}>🔗</span>
      </div>

      <div className="detail-content">
        <h2>{property.title}</h2>
        <p>{property.bedrooms} BHK • {property.location}</p>
        <p className="price">₹{Number(property.price).toLocaleString()} {property.is_villa ? "Villa" : "Flat"}</p>

        <h3>Description</h3>
        <p>{property.description}</p>

        <h3>Gallery</h3>
        <div className="gallery">
  {gallery.map((img, i) => (
    <img
      key={i}
      src={img}
      alt="gallery"
      onError={(e) => {
        const seeds = seededPics(property.id, 5);
        e.currentTarget.src = seeds[i % seeds.length];
      }}
    />
  ))}
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
