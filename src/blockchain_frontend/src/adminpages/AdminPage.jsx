import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import './admincss/AdminPage.css';

const AdminPage= () => {
  return (
    <div className="admin-container">
      <div className="admin-grid">
        <div className="admin-sidebar-column">
          <Sidebar />
        </div>
        <div className="admin-content-column">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;