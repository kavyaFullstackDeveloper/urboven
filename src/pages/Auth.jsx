
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, setUser as setUserStore, setToken } from "../utils/auth";
import { apiLogin, apiRegister, apiMe } from "../api";
import "./Auth.css";

export default function Auth({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const user = getUser(); 

  
  const next = (location.state && location.state.next) || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        await apiRegister({ name: form.name, email: form.email, password: form.password });
      }
      const { access } = await apiLogin({ email: form.email, password: form.password });
      setToken(access);
      const profile = await apiMe(access);
      setUserStore(profile);
      if (typeof setUser === "function") setUser(profile);
      navigate(next, { replace: true });
    } catch (err) {
      alert(err.message || "Auth failed");
    }
  };

 
  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Welcome, {user.name || user.email || user.username}</h2>
          <p>Logged in successfully.</p>
          <button onClick={() => navigate("/", { replace: true })}>Go to Home</button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Signup</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">{mode === "signup" ? "Create Account" : "Login"}</button>
        </form>
      </div>
    </div>
  );
}
