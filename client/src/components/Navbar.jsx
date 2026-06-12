import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("gymUser");
    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Smart Gym
        </Link>

        <div className="d-flex gap-2 flex-wrap">
          {!user && (
            <>
              <Link className="btn btn-success" to="/">
                Home
              </Link>

              <Link className="btn btn-success" to="/login">
                Login
              </Link>

              <Link className="btn btn-success" to="/signup">
                Sign Up
              </Link>
            </>
          )}

          {user && user.role === "user" && (
            <>
              <Link className="btn btn-success" to="/">
                Home
              </Link>

              <Link className="btn btn-success" to="/dashboard">
                Dashboard
              </Link>

              <Link className="btn btn-success" to="/workout-log">
                Workout Log
              </Link>

              <button className="btn btn-success" onClick={logout}>
                Logout
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link className="btn btn-success" to="/admin/users">
                User Management
              </Link>

              <Link className="btn btn-success" to="/admin/exercises">
                User Exercise Management
              </Link>

              <button className="btn btn-success" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;