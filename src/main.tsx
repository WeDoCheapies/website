
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

// Simple fallback component for error states
const ErrorFallback = ({ error }) => {
  return (
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
  )
}

// Render the full application for all routes
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
