import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              // Tampilan Header untuk Pengguna yang Sudah Login
              <>
                <Link to="/app" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Home
                </Link>
                {isAdmin && (
                  <Link to="/app/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/app/history" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Riwayat
                </Link>
                <div className="text-sm text-slate-300 hidden sm:block">
                  <span className="font-medium text-sky-400">{authData.user?.email}</span>
                  {' | '}
                  <span>Poin: <span className="font-bold text-emerald-400">{authData.user?.points}</span></span>
                </div>
                {!isAdmin && (
                   <Link to="/pricing" className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                    Isi Ulang Poin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              // Tampilan Header untuk Halaman Publik
              <>
                <Link to="/#fitur" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Fitur
                </Link>
                 <Link to="/pricing" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Harga
                </Link>
                <Link to="/login" className={`text-sm font-medium ${navLinkClass} transition-colors`}>
                  Login
                </Link>
                <Link to="/register" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm">
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
