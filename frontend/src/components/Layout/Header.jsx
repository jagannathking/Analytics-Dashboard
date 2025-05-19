import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Header.css';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Example for icons

const Header = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <header className="app-header">
      <div className="header-logo">
        <Link to="/">LeadGen Dashboard</Link>
      </div>
      <div className="header-actions">
        <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
          {/* {theme === 'light' ? <MoonIcon className="icon-size" /> : <SunIcon className="icon-size" />} */}
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {user && (
          <div className="user-info">
            <span className="username-display">Hi, {user.username}!</span>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;