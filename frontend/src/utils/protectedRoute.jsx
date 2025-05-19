import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />; // Or a more subtle loading indicator
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and the user's role is not in the array
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to a 'not authorized' page or back to the dashboard
    console.warn(`User role '${user.role}' not authorized for this route.`);
    return <Navigate to="/" replace />; // Or to an "/unauthorized" page
  }

  return <Outlet />; // Render the child route component (e.g., DashboardPage)
};

export default ProtectedRoute;