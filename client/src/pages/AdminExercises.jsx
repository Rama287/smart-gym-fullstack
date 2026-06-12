import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";

function AdminExercises() {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    exercise_name: "",
    sets: "",
    reps: "",
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      const data = await apiRequest("/admin/workouts");
      setWorkouts(data);
    } catch (error) {
      console.log(error.message);
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

  function handleChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function saveEdit(id) {
    try {
      await apiRequest(`/admin/workouts/${id}`, "PUT", {
        exercise_name: editForm.exercise_name,
        sets: Number(editForm.sets),
        reps: Number(editForm.reps),
      });

      setEditingId(null);
      loadWorkouts();
    } catch (error) {
      console.log(error.message);
    }
  }

  async function deleteWorkout(id) {
    try {
      await apiRequest(`/admin/workouts/${id}`, "DELETE");
      loadWorkouts();
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <main className="page">
      <div className="container mt-4">
        <h1 className="mb-3">User Exercise Management</h1>
        <p className="text-muted">
          Admin can view, edit, and delete exercises added by users.
        </p>

        <div className="card p-4 shadow-sm">
          <h3 className="mb-3">Users' Exercises</h3>

          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No user exercises added yet.
                    </td>
                  </tr>
                ) : (
                  workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>{workout.user_name}</td>
                      <td>{workout.user_email}</td>

                      {editingId === workout.id ? (
                        <>
                          <td>
                            <input
                              className="form-control"
                              name="exercise_name"
                              value={editForm.exercise_name}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              name="sets"
                              value={editForm.sets}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              name="reps"
                              value={editForm.reps}
                              onChange={handleChange}
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

export default AdminExercises;