import React from 'react';
import { NavLink } from 'react-router-dom';
import '../admincss/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/upload"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Upload
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/documents"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Documents
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/certificates"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              NFT Certificates
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/categories"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Categories
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;