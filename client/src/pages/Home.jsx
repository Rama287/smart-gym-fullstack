import { Link } from "react-router-dom";
import React from "react";

function Home() {
  return (
    <main className="hero-page">
      <section className="hero-card">
        <div>
          <p className="tag">Fitness Tracking Website</p>
          <h1>Smart Gym Assistant</h1>
          <p className="hero-text">
            Track workouts, view progress, and manage gym users and exercises from one simple website.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn">Get Started</Link>
            <Link to="/login" className="btn outline-btn">Login</Link>
          </div>
        </div>

        <div className="stats-box">
          <h3>Today Summary</h3>
          <div className="stat-row"><span>Workout</span><strong>45 min</strong></div>
          <div className="stat-row"><span>Calories</span><strong>230 kcal</strong></div>
          <div className="stat-row"><span>Exercises</span><strong>4</strong></div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Workout Log</h3>
          <p>Add daily exercises, duration, calories, and date.</p>
        </div>
        <div className="feature-card">
          <h3>User Dashboard</h3>
          <p>See total workouts, total calories, and recent activity.</p>
        </div>
        <div className="feature-card">
          <h3>Admin Panel</h3>
          <p>Manage users and gym exercises easily.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
