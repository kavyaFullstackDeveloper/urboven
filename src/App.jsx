import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import Auth from './pages/Auth.jsx';
import Detail from './pages/Detail.jsx';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>🏠 Urbo Ventures</div>
      <div className="menu">
        <button onClick={() => navigate("/auth")}>Login/Signup</button>
        <button onClick={() => navigate("/favorites")}>Favorites</button>
      </div>
    </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}
