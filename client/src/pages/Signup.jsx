import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api.js";

function Signup({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/signup", "POST", form);
      localStorage.setItem("gymUser", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <form className="card p-4 shadow auth-card" onSubmit={handleSubmit}>
        <h2 className="text-center mb-2">Create Account</h2>
        <p className="text-center text-muted">
          Start tracking your workouts today.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create password"
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Signup
        </button>

        <small className="d-block text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </main>
  );
}

export default Signup;