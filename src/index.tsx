import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

/**
 * Fungsi utama untuk me-render aplikasi React ke dalam DOM.
 */
function renderApp() {
  const rootElement = document.getElementById('root');
  
  // Pemeriksaan keamanan: jika elemen root tidak ada, hentikan eksekusi dan tampilkan pesan error.
  if (!rootElement) {
    console.error("Fatal Error: Could not find root element to mount to. The application cannot start.");
    // Tampilkan pesan fallback langsung di body jika terjadi kegagalan fatal.
    document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: sans-serif; color: #333;"><h1>Error Aplikasi</h1><p>Gagal memuat aplikasi karena elemen penting tidak ditemukan. Silakan coba muat ulang halaman atau hubungi dukungan.</p></div>';
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Pola yang kuat untuk memastikan DOM sepenuhnya dimuat sebelum aplikasi React mencoba untuk me-render.
// Ini mencegah race condition di mana skrip berjalan sebelum elemen '#root' ada.
if (document.readyState === 'loading') {
  // Jika DOM masih dalam proses loading, tambahkan event listener.
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // Jika DOMContentLoaded sudah terjadi, langsung jalankan fungsi render.
  renderApp();
}
