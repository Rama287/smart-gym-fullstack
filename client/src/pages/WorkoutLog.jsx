import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";

function WorkoutLog({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    exercise_name: "",
    sets: "",
    reps: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    exercise_name: "",
    sets: "",
    reps: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      if (!user) return;

      const data = await apiRequest(`/workouts/${user.id}`);
      setWorkouts(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await apiRequest("/workouts", "POST", {
        user_id: user.id,
        exercise_name: form.exercise_name,
        sets: Number(form.sets),
        reps: Number(form.reps),
      });

      setMessage("Workout added successfully");

      setForm({
        exercise_name: "",
        sets: "",
        reps: "",
      });

      loadWorkouts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEdit(workout) {
    setEditingId(workout.id);
    setEditForm({
      exercise_name: workout.exercise_name,
      sets: workout.sets,
      reps: workout.reps,
    });
  }

  async function saveEdit(id) {
    setMessage("");

    try {
      await apiRequest(`/workouts/${id}`, "PUT", {
        user_id: user.id,
        exercise_name: editForm.exercise_name,
        sets: Number(editForm.sets),
        reps: Number(editForm.reps),
      });

      setMessage("Workout updated successfully");
      setEditingId(null);
      loadWorkouts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteWorkout(id) {
    setMessage("");

    try {
      await apiRequest(`/workouts/${id}`, "DELETE", {
        user_id: user.id,
      });

      setMessage("Workout deleted successfully");
      loadWorkouts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="page">
      <div className="container mt-4">
        <h1 className="mb-3">Workout Log</h1>
        <p className="text-muted">
          Add, edit, and delete your workouts with sets and reps.
        </p>

        <div className="card p-4 shadow-sm mb-4">
          <h3 className="mb-3">Add Workout</h3>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Exercise Name</label>
              <input
                className="form-control"
                name="exercise_name"
                value={form.exercise_name}
                onChange={handleChange}
                placeholder="Example: Push Ups"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sets</label>
              <input
                className="form-control"
                type="number"
                name="sets"
                value={form.sets}
                onChange={handleChange}
                placeholder="Example: 3"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Reps</label>
              <input
                className="form-control"
                type="number"
                name="reps"
                value={form.reps}
                onChange={handleChange}
                placeholder="Example: 12"
              />
            </div>

            <button className="btn btn-success" type="submit">
              Save Workout
            </button>
          </form>
        </div>

        <div className="card p-4 shadow-sm">
          <h3 className="mb-3">My Workouts</h3>

          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No workouts added yet.
                    </td>
                  </tr>
                ) : (
                  workouts.map((workout) => (
                    <tr key={workout.id}>
                      {editingId === workout.id ? (
                        <>
                          <td>
                            <input
                              className="form-control"
                              name="exercise_name"
                              value={editForm.exercise_name}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <input
                              className="form-control"
                              type="number"
                              name="sets"
                              value={editForm.sets}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <input
                              className="form-control"
                              type="number"
                              name="reps"
                              value={editForm.reps}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => saveEdit(workout.id)}
                            >
                              Save
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{workout.exercise_name}</td>
                          <td>{workout.sets}</td>
                          <td>{workout.reps}</td>

                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => startEdit(workout)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteWorkout(workout.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkoutLog;