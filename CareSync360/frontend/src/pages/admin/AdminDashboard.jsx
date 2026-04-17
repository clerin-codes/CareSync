import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <section className="dashboard-content dashboard-page">
      <div className="ad-header-wrapper">
        <div className="ad-header-text">
          <h1>Admin Dashboard</h1>
          <p>System telemetry and active responder network status</p>
        </div>
        <div className="ad-status-badge">STATUS: ONLINE &amp; SYNCHRONIZED</div>
      </div>

      <div className="ad-grid-row-1">
        <div className="ad-top-card">
          <div className="ad-top-card-icon ad-tc-blue"></div>
          <div className="ad-top-card-info">
            <span>Total Members</span>
            <strong>33</strong>
          </div>
        </div>
        <div className="ad-top-card">
          <div className="ad-top-card-icon ad-tc-orange"></div>
          <div className="ad-top-card-info">
            <span>Active Alerts</span>
            <strong>10</strong>
          </div>
        </div>
        <div className="ad-top-card">
          <div className="ad-top-card-icon ad-tc-purple"></div>
          <div className="ad-top-card-info">
            <span>Avg Response</span>
            <strong>4364 min</strong>
          </div>
        </div>
        <div className="ad-top-card">
          <div className="ad-top-card-icon ad-tc-green"></div>
          <div className="ad-top-card-info">
            <span>Resolved Cases</span>
            <strong>3</strong>
          </div>
        </div>
      </div>

      <div className="ad-grid-row-2">
        <div className="ad-metric-card ad-mc-blue">
          <span>Total Patients</span>
          <strong>21</strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div className="ad-metric-card ad-mc-green">
          <span>Active Doctors</span>
          <strong>10</strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        </div>
        <div className="ad-metric-card ad-mc-purple">
          <span>Total Emergencies</span>
          <strong>13</strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        </div>
        <div className="ad-metric-card ad-mc-orange">
          <span>Resolved Cases</span>
          <strong>3</strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>

      <div className="ad-grid-row-3">
        <div className="ad-chart-panel">
          <div className="ad-chart-title">Emergency Matrix</div>
          <div className="ad-chart-pie-placeholder">
            <div className="ad-chart-pie"></div>
          </div>
        </div>

        <div className="ad-chart-panel">
          <div className="ad-chart-title">Performance Analytics</div>
          
          <div className="ad-perf-row">
            <div className="ad-perf-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            </div>
            <div className="ad-perf-text">
              <h4>Resolution Efficiency</h4>
              <p>Historical case closure velocity</p>
            </div>
            <div className="ad-perf-value">
              <strong>23%</strong>
              <span>Optimal</span>
            </div>
          </div>

          <div className="ad-perf-row">
            <div className="ad-perf-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
            <div className="ad-perf-text">
              <h4>Doctor Coverage</h4>
              <p>Active doctors vs total patients</p>
            </div>
            <div className="ad-perf-value">
              <strong>10 / 21</strong>
              <span className="blue">Doctors/Patients</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

export default AdminDashboard;

