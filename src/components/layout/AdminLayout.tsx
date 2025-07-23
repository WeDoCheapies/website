
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  redirectPath?: string;
  isCarWash?: boolean;
}

const AdminLayout = ({ 
  children, 
  redirectPath = '/auth',
  isCarWash = false 
}: AdminLayoutProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!isAuthenticated && !loading) {
      navigate(isCarWash ? '/car-wash/auth' : redirectPath);
    }
  }, [isAuthenticated, loading, navigate, redirectPath, isCarWash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className={`h-8 w-8 ${ isCarWash ? 'text-carwash-secondary' : 'text-dealership-secondary' } animate-spin`} />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default AdminLayout;
