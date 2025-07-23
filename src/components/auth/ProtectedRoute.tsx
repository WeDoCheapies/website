
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectPath 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Determine which auth page to redirect to based on the current path
  const getRedirectPath = () => {
    if (location.pathname.includes('car-wash')) {
      return '/car-wash/auth';
    }
    return redirectPath || '/auth';
  };

  // If not authenticated and not loading, redirect to auth page
  if (!loading && !isAuthenticated) {
    return <Navigate to={getRedirectPath()} replace state={{ from: location }} />;
  }

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className={`h-8 w-8 ${ location.pathname.includes('car-wash') ? 'text-carwash-secondary' : 'text-dealership-secondary' } animate-spin`} />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
