import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api.js";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  function loadUsers() {
    apiRequest("/users").then(setUsers);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function deleteUser(id) {
    await apiRequest(`/users/${id}`, "DELETE");
    loadUsers();
  }

  async function changeStatus(id) {
    await apiRequest(`/users/${id}/status`, "PUT");
    loadUsers();
  }

  return (
    <main className="page-container">
      <div className="page-title">
        <p className="tag">Admin View</p>
        <h1>User Management</h1>
        <p>Admin can view, block, and delete users.</p>
      </div>

      <section className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className="status-badge">{user.status}</span></td>
                <td>
                  <button className="btn small-btn" onClick={() => changeStatus(user.id)}>
                    Change Status
                  </button>
                  <button className="btn danger-btn" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default AdminUsers;
