import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-800 text-slate-300 mt-16 no-print">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="font-semibold text-white">Modul Ajar Cerdas</p>
                        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
                        <Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Harga</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};