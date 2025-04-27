import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
