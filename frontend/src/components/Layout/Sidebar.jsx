import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
// Example: using react-icons
// import { FaTachometerAlt, FaUsers, FaBullhorn } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="app-sidebar">
      <div className="sidebar-logo-section">
        {/* You can add a logo image here */}
        {/* <img src="/path-to-your-logo.png" alt="App Logo" className="sidebar-logo-img" /> */}
        <span className="sidebar-app-name">Lead Gen</span>
      </div>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            {/* <FaTachometerAlt className="nav-icon" /> */}
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/leads" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            {/* <FaUsers className="nav-icon" /> */}
            <span>Leads</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/campaigns" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            {/* <FaBullhorn className="nav-icon" /> */}
            <span>Campaigns</span>
          </NavLink>
        </li>
        {/* Add more navigation items here */}
      </ul>
      <div className="sidebar-footer">
        {/* Optional: user profile quick link or settings */}
        <p>© {new Date().getFullYear()} YourCompany</p>
      </div>
    </nav>
  );
};
export default Sidebar;