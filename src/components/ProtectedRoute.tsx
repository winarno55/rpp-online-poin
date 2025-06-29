import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, authData } = useAuth();
  const location = useLocation();

  // Handle initial loading state where authData might not be populated yet
  if (authData.token && !authData.user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner/>
        </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admins trying to access admin routes to the main app page
    return <Navigate to="/app" replace />;
  }

  return children;
};