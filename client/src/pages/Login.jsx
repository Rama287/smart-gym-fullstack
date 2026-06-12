import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api.js";


function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/login", "POST", form);
      localStorage.setItem("gymUser", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <form className="card p-4 shadow auth-card" onSubmit={handleSubmit}>
        <h2 className="text-center mb-2">Login</h2>
        <p className="text-center text-muted">
          Welcome back to Smart Gym Assistant.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

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
            placeholder="Enter your password"
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Login
        </button>

        <small className="d-block text-center mt-3">
          Do not have an account? <Link to="/signup">Signup</Link>
        </small>
      </form>
    </main>
  );
}

export default Login;