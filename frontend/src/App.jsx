import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import useAuth from './hooks/useAuth.js'; // Can be .jsx
import ProtectedRoute from './utils/protectedRoute.jsx';

// Layout Components
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';

// Page Components
import LoginPage from './components/Auth/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LeadsPage from './pages/LeadsPage.jsx'; // Placeholder
import CampaignsPage from './pages/CampaignsPage.jsx'; // Placeholder
import NotFoundPage from './pages/NotFoundPage.jsx';

import './App.css';

const AuthenticatedPageLayout = ({ children }) => (
  <div className="main-content-area">
    <Header />
    <div className="page-content-wrapper">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="app-loading-text">Initializing...</div>;
  }

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<AuthenticatedPageLayout><DashboardPage /></AuthenticatedPageLayout>}
          />
          <Route
            path="/leads"
            element={<AuthenticatedPageLayout><LeadsPage /></AuthenticatedPageLayout>}
          />
          <Route
            path="/campaigns"
            element={<AuthenticatedPageLayout><CampaignsPage /></AuthenticatedPageLayout>}
          />
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated ?
            <AuthenticatedPageLayout><NotFoundPage /></AuthenticatedPageLayout> :
            <NotFoundPage /> /* Or redirect to login */
          }
        />
      </Routes>
    </div>
  );
};

export default App;