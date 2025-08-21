import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

// Halaman Publik (Lazy Loaded)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

// Halaman Otentikasi (Lazy Loaded)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Halaman Aplikasi Inti (Dilindungi & Lazy Loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const HistoryDetailPage = lazy(() => import('./pages/HistoryDetailPage'));


const App: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  const mainBgClass = isAppRoute
    ? "bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100" // Background untuk aplikasi
    : "bg-white text-slate-800"; // Background untuk halaman publik

  return (
    <div className={`min-h-screen ${mainBgClass}`} style={{fontFamily: "'Poppins', sans-serif"}}>
      <Header />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
        <Suspense fallback={
            <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
              <LoadingSpinner />
            </div>
          }>
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Rute Otentikasi */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* Rute Aplikasi Inti yang Dilindungi */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/app/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/app/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/app/history/:id"
              element={
                <ProtectedRoute>
                  <HistoryDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Pengalihan untuk bookmark lama */}
            <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
            <Route path="/history" element={<Navigate to="/app/history" replace />} />
            <Route path="/history/:id" element={<Navigate to="/app/history/:id" replace />} />

          </Routes>
        </Suspense>
      </main>
      {!isAppRoute && <Footer />}
    </div>
  );
};

export default App;