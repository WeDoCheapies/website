
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize QueryClient
const queryClient = new QueryClient();

// Import all pages with lazy loading
const CarWash = lazy(() => import("@/pages/CarWash"));
const CarWashAdmin = lazy(() => import("@/pages/CarWashAdmin"));
const CarWashAuth = lazy(() => import("@/pages/CarWashAuth"));
const CarWashServices = lazy(() => import("@/pages/CarWashServices"));
const CarWashLoyalty = lazy(() => import("@/pages/CarWashLoyalty"));
const CarWashGallery = lazy(() => import("@/pages/CarWashGallery"));
const CarWashContact = lazy(() => import("@/pages/CarWashContact"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const WashTypeManagement = lazy(() => import("@/pages/WashTypeManagement"));

// Dealership pages
const Home = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Inventory = lazy(() => import("@/pages/Inventory"));
const CarDetail = lazy(() => import("@/pages/CarDetail"));
const CarTrade = lazy(() => import("@/pages/CarTrade"));
const DealershipAdmin = lazy(() => import("@/pages/DealershipAdmin"));
const DealershipAuth = lazy(() => import("@/pages/DealershipAuth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carwash-secondary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={({ error }) => (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="mb-4 text-gray-700">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Reload page
            </button>
          </div>
        </div>
      )}>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Car Wash Routes */}
              <Route path="/car-wash" element={<CarWash />} />
              <Route path="/car-wash/services" element={<CarWashServices />} />
              <Route path="/car-wash/loyalty" element={<CarWashLoyalty />} />
              <Route path="/car-wash/gallery" element={<CarWashGallery />} />
              <Route path="/car-wash/contact" element={<CarWashContact />} />
              
              {/* Car Wash Admin Routes */}
              <Route path="/car-wash/admin" element={
                <ProtectedRoute redirectPath="/car-wash/auth">
                  <CarWashAdmin />
                </ProtectedRoute>
              } />
              <Route path="/car-wash/admin/wash-types" element={
                <ProtectedRoute redirectPath="/car-wash/auth">
                  <WashTypeManagement />
                </ProtectedRoute>
              } />
              
              {/* Authentication Routes */}
              <Route path="/car-wash/auth" element={<CarWashAuth />} />
              <Route path="/auth" element={<DealershipAuth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Dealership Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<CarDetail />} />
              <Route path="/car-trade" element={<CarTrade />} />
              
              {/* Dealership Admin Route */}
              <Route path="/admin" element={
                <ProtectedRoute redirectPath="/auth">
                  <DealershipAdmin />
                </ProtectedRoute>
              } />
              
              {/* Redirect legacy admin routes to the auth page */}
              <Route path="/admin/*" element={<Navigate to="/auth" replace />} />
              {/* Redirect services page to home */}
              <Route path="/services" element={<Navigate to="/" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
