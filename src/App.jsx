import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Auth from "./pages/Auth.jsx";
import Detail from "./pages/Detail.jsx";
import { getUser, clearAuth } from "./utils/auth";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => { setUser(getUser()); }, [location.pathname]);

  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
    navigate("/", { replace: true });
  }, [navigate]);
  
const label = user?.name || user?.first_name || user?.username || user?.email;


  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>🏠 Urbo Ventures</div>
        <div className="menu">
          {user ? (
  <>
    <span>👋 Welcome, {label}</span>
    <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
  </>
) : (
  <button onClick={() => navigate("/auth")}>Login/Signup</button>
)}
          <button onClick={() => navigate("/favorites")}>Favorites</button>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}
