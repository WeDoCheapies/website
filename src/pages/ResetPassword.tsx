
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to extract access token from URL
    const extractAccessToken = () => {
      // First check if we have a hash in the URL
      const hashString = window.location.hash;
      
      if (hashString && hashString.includes('access_token=')) {
        // Remove the # from the hash string
        const hashParams = new URLSearchParams(hashString.substring(1));
        const token = hashParams.get('access_token');
        
        if (token) {
          console.log("Token found in hash");
          setAccessToken(token);
          return;
        }
      }
      
      // If no token in hash, check query string
      const searchParams = new URLSearchParams(window.location.search);
      const searchToken = searchParams.get('access_token');
      
      if (searchToken) {
        console.log("Token found in search params");
        setAccessToken(searchToken);
        return;
      }
      
      // No token found in either location
      console.log("No token found in URL");
      setError('No access token provided. The password reset link may be invalid or expired.');
    };
    
    extractAccessToken();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!accessToken) {
      setError('No access token available. Please request a new password reset link.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Setting session with access token");
      // Set the session with the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }
      
      console.log("Updating user password");
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }
      
      setResetSuccessful(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been changed. You'll be redirected to login."
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/car-wash/auth');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password');
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.message || 'Failed to reset password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] max-w-[95%] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <KeyRound className="mr-2 h-6 w-6 text-carwash-secondary" />
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {!resetSuccessful ? 'Enter your new password below' : 'Password successfully reset'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSuccessful ? (
            <div className="py-6 flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">
                Your password has been successfully reset. You will be redirected to the login page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {!accessToken ? (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>
                    Invalid or expired password reset link. Please request a new password reset email.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading || resetSuccessful || !accessToken}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading || resetSuccessful || !accessToken}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {accessToken && (
                <Button 
                  type="submit"
                  className="w-full bg-carwash-primary hover:bg-carwash-primary/90"
                  disabled={loading || resetSuccessful || !accessToken}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : "Reset Password"}
                </Button>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => navigate('/car-wash/auth')}
            className="text-sm text-muted-foreground"
            disabled={loading}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
