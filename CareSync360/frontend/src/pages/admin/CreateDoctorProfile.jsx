import { useState } from "react";

function CreateDoctorProfile() {
  const [selectedReport, setSelectedReport] = useState("appointments");

  return (
    <section className="dashboard-content dashboard-page">
      <div className="ad-header-wrapper">
        <div className="ad-header-text">
          <h1>System Analytics &amp; Reports</h1>
          <p>Advanced intelligence metrics, demographic distribution and comprehensive report generation</p>
        </div>
      </div>

      <div className="ad-an-center">
        <div className="ad-an-title">
          <div className="ad-an-icon-large">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <h2>Report Generation Center</h2>
            <p>Generate detailed analytics reports for patients or doctors</p>
          </div>
        </div>

        <h3 className="ad-sect-title">Select Report Category</h3>
        
        <div className="ad-an-grid">
          <div className={`ad-report-card ${selectedReport === "appointments" ? "selected" : ""}`} onClick={() => setSelectedReport("appointments")}>
            <div className="ad-rc-top">
              <div className="ad-rc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div>
                <h3>Appointments <span className="ad-rc-tag">Targeted</span></h3>
              </div>
            </div>
            <p className="ad-rc-desc">Meeting scheduled analytics, consultation types, and completion telemetry</p>
            <div className="ad-rc-tags">
              <span>8+ Metrics</span>
              <span>Yesterday/Data</span>
            </div>
          </div>

          <div className={`ad-report-card ${selectedReport === "emergencies" ? "selected" : ""}`} onClick={() => setSelectedReport("emergencies")}>
            <div className="ad-rc-top">
              <div className="ad-rc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div>
                <h3>Emergencies</h3>
              </div>
            </div>
            <p className="ad-rc-desc">District-wise emergency cases, resolution times, and responder performance</p>
            <div className="ad-rc-tags">
              <span>All Districts</span>
              <span>Real-Time Response</span>
            </div>
          </div>

          <div className={`ad-report-card ${selectedReport === "patients" ? "selected" : ""}`} onClick={() => setSelectedReport("patients")}>
            <div className="ad-rc-top">
              <div className="ad-rc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3>Patients</h3>
              </div>
            </div>
            <p className="ad-rc-desc">Comprehensive patient demographics and historical medical telemetry</p>
            <div className="ad-rc-tags">
              <span>15+ Data Points</span>
              <span>4 Sections</span>
            </div>
          </div>

          <div className={`ad-report-card ${selectedReport === "doctors" ? "selected" : ""}`} onClick={() => setSelectedReport("doctors")}>
            <div className="ad-rc-top">
              <div className="ad-rc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <div>
                <h3>Doctors</h3>
              </div>
            </div>
            <p className="ad-rc-desc">Doctor performance, specialization metrics and consult analytics</p>
            <div className="ad-rc-tags">
              <span>10+ Metrics</span>
              <span>Full Profile</span>
            </div>
          </div>

          <div className={`ad-report-card ${selectedReport === "trends" ? "selected" : ""}`} onClick={() => setSelectedReport("trends")}>
            <div className="ad-rc-top">
              <div className="ad-rc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <div>
                <h3>Future Trends</h3>
              </div>
            </div>
            <p className="ad-rc-desc">Predictive analytics for future case volumes and growth margins</p>
            <div className="ad-rc-tags">
              <span>AI Projection</span>
              <span>Dynamic Accuracy</span>
            </div>
          </div>
        </div>

        <div className="ad-an-bottom">
          <div>
            <h3 className="ad-sect-title">Report Includes</h3>
            <div className="ad-chk-list">
              <label className="ad-chk-item">
                <input type="checkbox" defaultChecked />
                Total appointments scheduled
              </label>
              <label className="ad-chk-item">
                <input type="checkbox" defaultChecked />
                Consultation type breakdown (Video/In-person)
              </label>
              <label className="ad-chk-item">
                <input type="checkbox" defaultChecked />
                Completion &amp; Cancellation rates
              </label>
              <label className="ad-chk-item">
                <input type="checkbox" defaultChecked />
                Daily booking trends &amp; analytics
              </label>
            </div>
          </div>

          <div>
            <h3 className="ad-sect-title">Date Range</h3>
            <div className="ad-date-grp">
              <label>From Date</label>
              <input type="date" defaultValue="2026-03-18" />
            </div>
            <div className="ad-date-grp">
              <label>To Date</label>
              <input type="date" />
            </div>
          </div>

          <div>
            <h3 className="ad-sect-title">Generate Intelligence</h3>
            <div className="ad-gen-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <p>No report generated yet</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default CreateDoctorProfile;

