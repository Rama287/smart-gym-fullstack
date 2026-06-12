import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";

function Dashboard({ user }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (user) {
      apiRequest(`/workouts/${user.id}`).then(setWorkouts);
    }
  }, [user]);

  const totalSets = workouts.reduce(
    (sum, item) => sum + Number(item.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (sum, item) => sum + Number(item.reps || 0),
    0
  );

  return (
    <main className="page-container">
      <div className="page-title">
        <p className="tag">User View</p>
        <h1>Hello, {user.name}</h1>
        <p>This is your workout dashboard.</p>
      </div>

      <section className="dashboard-grid">
        <div className="summary-card">
          <h3>Total Workouts</h3>
          <strong>{workouts.length}</strong>
        </div>

        <div className="summary-card">
          <h3>Total Sets</h3>
          <strong>{totalSets}</strong>
        </div>

        <div className="summary-card">
          <h3>Total Reps</h3>
          <strong>{totalReps}</strong>
        </div>
      </section>

      <section className="table-card">
        <h2>Recent Workouts</h2>

        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
              </tr>
            </thead>

            <tbody>
              {workouts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No workouts added yet.
                  </td>
                </tr>
              ) : (
                workouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.exercise_name}</td>
                    <td>{workout.sets}</td>
                    <td>{workout.reps}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;