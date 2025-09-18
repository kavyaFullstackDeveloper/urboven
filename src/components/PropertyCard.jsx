// src/components/PropertyCard.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import "./PropertyCard.css";
import { API_BASE } from "../api";

// Seeded placeholder based on property id (stable but different)
function seededPlaceholder(id, w = 600, h = 400, k = 0) {
  const n = Number(id) || 0;
  const picId = (n * 37 + 11 + k * 17) % 300; // pseudo-random 0..299
  return `https://picsum.photos/id/${picId}/${w}/${h}`;
}

function normalizeAbsolute(urlOrPath) {
  if (!urlOrPath) return "";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const base = API_BASE?.replace(/\/+$/, "") || "";
  const rel = String(urlOrPath).startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${base}${rel}`;
}

export default function PropertyCard({ prop = {}, small }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [errorBump, setErrorBump] = useState(0); // change seed on errors
  const timerRef = useRef(null);

  // Build a gallery for the card:
  // 1) backend detail_images
  // 2) backend image_url and image (relative)
  // 3) seeded placeholders (5 items, stable per id)
  const gallery = useMemo(() => {
    const out = [];

    // prefer backend provided gallery
    if (Array.isArray(prop.detail_images) && prop.detail_images.length) {
      for (const g of prop.detail_images) {
        if (g) out.push(normalizeAbsolute(g));
      }
    }

    // fallback to a single real image
    if (!out.length) {
      if (prop.image_url) out.push(normalizeAbsolute(prop.image_url));
      else if (prop.image) out.push(normalizeAbsolute(prop.image));
    }

    // ensure a minimum of 5 images with seeded placeholders
    if (out.length < 5) {
      const missing = 5 - out.length;
      for (let k = 0; k < missing; k++) {
        out.push(seededPlaceholder(prop.id, small ? 480 : 600, small ? 320 : 400, k + errorBump));
      }
    }

    // de-dup and filter
    return out.filter(Boolean);
  }, [prop.detail_images, prop.image_url, prop.image, prop.id, small, errorBump]);

  // Ensure favorite state
  useEffect(() => { setFav(isFavorite(prop.id)); }, [prop.id]);

  // Auto-advance carousel every 3s when not paused
  useEffect(() => {
    if (paused || gallery.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [paused, gallery.length]);

  const handleFav = useCallback((e) => {
    e.stopPropagation();
    if (!isLoggedIn()) { alert("Please login to favorite properties!"); navigate("/auth"); return; }
    toggleFavorite(prop.id);
    setFav((v) => !v);
  }, [navigate, prop.id]);

  const prev = useCallback((e) => {
    e?.stopPropagation?.();
    setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const next = useCallback((e) => {
    e?.stopPropagation?.();
    setIdx((i) => (i + 1) % gallery.length);
  }, [gallery.length]);

  const onImgError = useCallback((e) => {
    // If an image fails, bump seed to regenerate placeholders and move on
    setErrorBump((k) => k + 1);
    next();
  }, [next]);

  const title = prop.title || "Property";
  const bedrooms = Number(prop.bedrooms ?? 0);
  const price = useMemo(() => Number.isFinite(Number(prop.price)) ? Number(prop.price) : 0, [prop.price]);
  const avgPrice = useMemo(() => Number.isFinite(Number(prop.avg_price)) ? Number(prop.avg_price) : 0, [prop.avg_price]);

  return (
    <div
      className={`property-card ${small ? "small" : ""}`}
      onClick={() => navigate(`/detail/${prop.id}`)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="fav-icon" onClick={handleFav}>{fav ? "❤️" : "🤍"}</div>

      <div className="property-img carousel">
        <button className="nav left" onClick={prev} aria-label="Previous">‹</button>

        <div className="viewport">
          <div
            className="track"
            style={{
              width: `${gallery.length * 100}%`,
              transform: `translateX(-${(100 / gallery.length) * idx}%)`,
            }}
          >
            {gallery.map((src, i) => (
              <div className="slide" key={`${i}-${src}`}>
                <img src={src} alt={`${title} ${i + 1}`} onError={onImgError} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <button className="nav right" onClick={next} aria-label="Next">›</button>

        <div className="dots">
          {gallery.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === idx ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="property-info">
        <div className="days">{Number(prop.days_ago ?? 0)} days ago</div>
        <h3>{title}</h3>
        <p>{bedrooms} BHK • {prop.location || "—"}</p>
        <p className="price">₹{price.toLocaleString()} {prop.is_villa ? "• Villa" : "• Flat"}</p>
        <p className="avg">Avg price: ₹{avgPrice.toLocaleString()}</p>
        <hr />
        <div className="seller"><span>Seller: {prop.seller_name || "—"}</span><button>Contact</button></div>
      </div>
    </div>
  );
}
