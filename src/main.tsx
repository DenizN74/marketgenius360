import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { initializeMonitoring } from './lib/monitoring';
import './index.css';

// Initialize Sentry
initializeMonitoring();

const root = createRoot(document.getElementById('root')!);

// Wrap the app with Sentry error boundary
root.render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-4">
          We've been notified and are working to fix the issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}