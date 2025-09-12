import { login, getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (getUser()) navigate("/"); // already logged in
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form); // store user in localStorage
    navigate("/"); // redirect to home
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome to Urbo Ventures</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" onChange={(e)=>setForm({...form, name:e.target.value})} />
          <input type="email" placeholder="Email" onChange={(e)=>setForm({...form, email:e.target.value})} />
          <input type="password" placeholder="Password" onChange={(e)=>setForm({...form, password:e.target.value})} />
          <button type="submit">Login / Signup</button>
        </form>
      </div>
    </div>
  );
}
