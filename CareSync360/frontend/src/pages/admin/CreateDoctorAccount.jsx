import { useState } from "react";

function CreateDoctorAccount() {
  const users = [
    { id: 1, name: "c", email: "gabewe8036@bmoar.com", role: "PATIENT", status: "ACTIVE" },
    { id: 2, name: "System Admin", email: "admin@careline360.com", role: "ADMIN", status: "ACTIVE" },
    { id: 3, name: "Pirakash Ravindran", email: "pirakash@gmail.com", role: "PATIENT", status: "ACTIVE" },
    { id: 4, name: "shajana SS", email: "0777777777", role: "PATIENT", status: "ACTIVE" },
    { id: 5, name: "Test User XYZ", email: "testuserxyz@example.com", role: "PATIENT", status: "ACTIVE" },
    { id: 6, name: "Test Patient", email: "testpatient@example.com", role: "PATIENT", status: "ACTIVE" }
  ];

  return (
    <section className="dashboard-content dashboard-page">
      <div className="ad-mu-header">
        <div className="ad-header-text">
          <h1>User Management</h1>
          <p>Total 33 users registered in the system</p>
        </div>
        <button className="btn-add-user">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New User
        </button>
      </div>

      <div className="ad-mu-toolbar">
        <div className="ad-mu-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search by name, email or phone..." />
        </div>
        <div className="ad-mu-filter">
          <select>
            <option>All Roles</option>
            <option>Patient</option>
            <option>Doctor</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      <table className="ad-mu-table">
        <thead>
          <tr>
            <th>User Identity</th>
            <th>Designation</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <div className="ad-table-user">
                  <div className="ad-table-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="ad-table-user-info">
                    <strong>{u.name}</strong>
                    <span>{u.email}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className={`ad-badge ${u.role === "ADMIN" ? "ad-badge-admin" : "ad-badge-patient"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <div className="ad-status-active">{u.status}</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="ad-actions" style={{ justifyContent: "flex-end" }}>
                  <button><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                  <button><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg></button>
                  <button className="active-toggle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg></button>
                  <button><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default CreateDoctorAccount;

