import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ComplaintButton } from './ComplaintWidget';

export const Header: React.FC = () => {
  const { authData, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAppRoute = location.pathname.startsWith('/app');
  const isPublicRoute = !isAppRoute;

  const appLogoLink = isAuthenticated ? "/app" : "/";

  const headerBgClass = isPublicRoute 
    ? "bg-white/80 backdrop-blur-sm shadow-md" 
    : "bg-slate-900/50 backdrop-blur-sm shadow-lg";

  const navLinkClass = isPublicRoute
    ? "text-slate-600 hover:text-sky-600"
    : "text-slate-300 hover:text-white";

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${headerBgClass}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={appLogoLink} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            Modul Ajar Cerdas
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              // Tampilan Header untuk Pengguna yang Sudah Login
              <>
                <Link to="/app" className={`text-sm font-medium ${navLinkClass} transition-colors hidden sm:block`}>
                  Home
                </Link>
                {isAdmin && (
                  <Link to="/app/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/app/history" className={`text-sm font-medium ${navLinkClass} transition-colors hidden sm:block`}>
                  Riwayat
                </Link>
                <Link to="/app/affiliate" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                  <span>💰 Afiliasi</span>
                </Link>
                <div className="text-sm text-slate-300 hidden md:block">
                  <span className="font-medium text-sky-400">{authData.user?.email}</span>
                  {' | '}
                  <span>Poin: <span className="font-bold text-emerald-400">{authData.user?.points}</span></span>
                </div>
                {!isAdmin && (
                   <Link to="/pricing" className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors hidden sm:block">
                    Isi Ulang
                  </Link>
                )}
                {/* Tombol Aduan atau Saran */}
                <ComplaintButton 
                  text="Aduan / Saran" 
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all" 
                />
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-xs sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              // Tampilan Header untuk Halaman Publik
              <>
                <Link to="/" className={`text-sm font-medium ${navLinkClass} transition-colors hidden sm:block`}>
                  Beranda
                </Link>
                <Link to="/#fitur" className={`text-sm font-medium ${navLinkClass} transition-colors hidden sm:block`}>
                  Fitur
                </Link>
                 <Link to="/pricing" className={`text-sm font-medium ${navLinkClass} transition-colors hidden sm:block`}>
                  Harga
                </Link>
                {/* Tombol Aduan atau Saran */}
                <ComplaintButton 
                  text="Aduan / Saran" 
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all" 
                />
                <Link to="/login" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Login
                </Link>
                <Link to="/register" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-xs sm:text-sm">
                  Daftar Gratis
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
