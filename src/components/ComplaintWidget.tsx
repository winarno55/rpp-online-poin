import React, { useState, useEffect } from 'react';

export const ComplaintButton: React.FC<{ className?: string; text?: string; variant?: 'header' | 'footer' | 'floating' }> = ({ 
    className = "", 
    text = "Aduan / Saran",
    variant = "header"
}) => {
    const [complaintUrl, setComplaintUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/pricing/config');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.complaintUrl) {
                        setComplaintUrl(data.complaintUrl);
                    }
                }
            } catch (err) {
                console.error("Error fetching complaint url:", err);
            }
        };
        fetchConfig();
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        const targetUrl = complaintUrl && complaintUrl.trim() !== '' 
            ? complaintUrl 
            : 'https://wa.me/6282232835976?text=Halo%20Admin%20Modul%20Ajar%20Cerdas,%20saya%20ingin%20menyampaikan%20aduan/saran...';
        
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => setLoading(false), 500);
    };

    if (variant === 'floating') {
        return (
            <button
                onClick={handleClick}
                className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-5 rounded-full shadow-2xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all duration-300 text-sm group no-print ${className}`}
                title="Klik untuk mengisi Aduan atau Saran"
            >
                <span className="text-lg animate-bounce">💬</span>
                <span>{loading ? 'Membuka...' : text}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center gap-1.5 font-medium transition-all duration-200 cursor-pointer ${className}`}
            title="Klik untuk menyampaikan Aduan atau Saran"
        >
            <span>💬</span>
            <span>{text}</span>
        </button>
    );
};
