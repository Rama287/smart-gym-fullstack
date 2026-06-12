import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WorkoutLog from "./pages/WorkoutLog.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminExercises from "./pages/AdminExercises.jsx";

function App() {
  const savedUser = JSON.parse(localStorage.getItem("gymUser"));
  const [user, setUser] = useState(savedUser);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/workout-log"
          element={user ? <WorkoutLog user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={user && user.role === "admin" ? <AdminUsers /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/exercises"
          element={user && user.role === "admin" ? <AdminExercises /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
