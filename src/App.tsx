
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Halaman Publik
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PricingPage from './pages/PricingPage';

// Halaman Otentikasi
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Halaman Aplikasi Inti (Dilindungi)
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import PaymentStatusPage from './pages/PaymentStatusPage'; // Import halaman baru

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
          <Route 
            path="/app/payment-status"
            element={
              <ProtectedRoute>
                <PaymentStatusPage />
              </ProtectedRoute>
            }
          />
          {/* Redirect any other sub-routes of /app back to /app */}
          <Route path="/app/*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>
      {!isAppRoute && <Footer />}
    </div>
  );
};

export default App;
