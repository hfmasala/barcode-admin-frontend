// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SkuListPage from './pages/SkuListPage';
import DashboardPage from './pages/DashboardPage';
import PrintLabelPage from './pages/PrintLabelPage'; // <-- IMPORT NEW PAGE

// A helper to protect routes
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Main App component
function App() {
  return (
    <div className="dark h-screen w-full bg-background text-foreground">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* --- NEW PRINT ROUTE --- */}
          {/* This route is outside the main layout on purpose */}
          <Route 
            path="/print/sku/:skuId" 
            element={
              <ProtectedRoute>
                <PrintLabelPage />
              </ProtectedRoute>
            } 
          />
          {/* --- END NEW ROUTE --- */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} /> 
            <Route path="dashboard" element={<DashboardPage />} /> 
            <Route path="skus" element={<SkuListPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;