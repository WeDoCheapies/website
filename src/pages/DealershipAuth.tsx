
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const DealershipAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state if it exists
  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    // Redirect to admin if already authenticated
    if (isAuthenticated && !loading) {
      navigate(from);
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast({
        description: "Signed in successfully",
      });
      // Navigate will happen in useEffect when isAuthenticated updates
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to sign in",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-dealership-secondary animate-spin" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/671a3e7f-2f7e-4017-820a-8f9ade87a7f5.png" 
              alt="We Do Cheapies" 
              className="h-16" 
              loading="eager"
            />
          </div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Sign in to manage your inventory</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealershipAuth;
