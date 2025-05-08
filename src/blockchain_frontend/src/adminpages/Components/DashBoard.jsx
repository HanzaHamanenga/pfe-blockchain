import React from 'react';
import '../admincss/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>ADMIN DASHBOARD</h1>
      <div className="dashboard-content">
        <p>Welcome to the admin dashboard. Select a section from the sidebar.</p>

        <h2>Dashboard Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Documents</h3>
            <p>124</p>
          </div>
          <div className="stat-card">
            <h3>NFT Certificates</h3>
            <p>87</p>
          </div>
          <div className="stat-card">
            <h3>Active Categories</h3>
            <p>4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;