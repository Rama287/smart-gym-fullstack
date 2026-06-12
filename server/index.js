import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Gym PostgreSQL API is running");
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, status`,
      [name, email, password, "user", "Active"]
    );

    res.json({
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, name, email, role, status
       FROM users
       WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    if (result.rows[0].status === "Blocked") {
      return res.status(403).json({ message: "This account is blocked" });
    }

    res.json({
      message: "Login successful",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// Admin: get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, status FROM users ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not get users",
      error: error.message,
    });
  }
});

// Admin: delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete user",
      error: error.message,
    });
  }
});

// Admin: block/unblock user
app.put("/api/users/:id/status", async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT status FROM users WHERE id = $1",
      [req.params.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentStatus = userResult.rows[0].status;
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";

    const result = await pool.query(
      `UPDATE users
       SET status = $1
       WHERE id = $2
       RETURNING id, name, email, role, status`,
      [newStatus, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Could not update user status",
      error: error.message,
    });
  }
});

// User: get workouts for one user
app.get("/api/workouts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT id, exercise_name, sets, reps
       FROM workouts
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not get workouts",
      error: error.message,
    });
  }
});


// User: add workout manually
app.post("/api/workouts", async (req, res) => {
  try {
    const { user_id, exercise_name, sets, reps } = req.body;

    if (!user_id || !exercise_name || !sets || !reps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO workouts (user_id, exercise_name, sets, reps)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        Number(user_id),
        exercise_name,
        Number(sets),
        Number(reps)
      ]
    );

    res.status(201).json({
      message: "Workout added successfully",
      workout: result.rows[0],
    });
  } catch (error) {
    console.log("Add workout error:", error.message);

    res.status(500).json({
      message: "Could not add workout",
      error: error.message,
    });
  }
});
// User: edit their own workout
app.put("/api/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, exercise_name, sets, reps } = req.body;

    if (!user_id || !exercise_name || !sets || !reps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `UPDATE workouts
       SET exercise_name = $1,
           sets = $2,
           reps = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        exercise_name,
        Number(sets),
        Number(reps),
        Number(id),
        Number(user_id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({
      message: "Workout updated successfully",
      workout: result.rows[0],
    });
  } catch (error) {
    console.log("User update workout error:", error.message);

    res.status(500).json({
      message: "Could not update workout",
      error: error.message,
    });
  }
});

// User: delete their own workout
app.delete("/api/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await pool.query(
      "DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING *",
      [Number(id), Number(user_id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.log("User delete workout error:", error.message);

    res.status(500).json({
      message: "Could not delete workout",
      error: error.message,
    });
  }
});

// Admin: get all users' workouts
app.get("/api/admin/workouts", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT workouts.id,
              workouts.exercise_name,
              workouts.sets,
              workouts.reps,
              users.name AS user_name,
              users.email AS user_email
       FROM workouts
       JOIN users ON workouts.user_id = users.id
       ORDER BY workouts.id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not get all workouts",
      error: error.message,
    });
  }
});

// Admin: edit user workout
app.put("/api/admin/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise_name, sets, reps } = req.body;

    if (!exercise_name || !sets || !reps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `UPDATE workouts
       SET exercise_name = $1,
           sets = $2,
           reps = $3
       WHERE id = $4
       RETURNING *`,
      [exercise_name, sets, reps, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({
      message: "Workout updated successfully",
      workout: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update workout",
      error: error.message,
    });
  }
});

// Admin: delete user workout
app.delete("/api/admin/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM workouts WHERE id = $1", [id]);

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete workout",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});