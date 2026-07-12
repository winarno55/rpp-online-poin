import React from 'react';
import { LessonPlanInput } from '../types';
import { KELAS_OPTIONS, getFaseForKelas } from '../constants';

interface Props {
  formData: LessonPlanInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  bundleCost: number;
}

export const IdentityForm: React.FC<Props> = ({ formData, handleChange, onSubmit, isLoading, bundleCost }) => {
  const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all";
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Data Identitas & Kurikulum</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Satuan Pendidikan</label>
          <input type="text" name="satuanPendidikan" value={formData.satuanPendidikan} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mata Pelajaran</label>
          <input type="text" name="mataPelajaran" value={formData.mataPelajaran} onChange={handleChange} className={inputClass} placeholder="Contoh: Matematika" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Singkatan Mapel</label>
          <input type="text" name="singkatan" value={formData.singkatan} onChange={handleChange} className={inputClass} placeholder="Contoh: MAT" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas <span className="text-slate-500 font-normal ml-1">({getFaseForKelas(formData.kelasFase)})</span></label>
          <select name="kelasFase" value={formData.kelasFase} onChange={handleChange} className={inputClass}>
            <option value="" disabled>Pilih Kelas</option>
            {KELAS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Alokasi Waktu</label>
          <input type="text" name="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <span>CP Umum (Capaian Pembelajaran)</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Mengacu ke BSKAP No. 046/H/KR/2025 Terbaru
            </span>
          </label>
          <textarea 
            name="cpUmum" 
            value={formData.cpUmum} 
            onChange={handleChange} 
            className={inputClass} 
            rows={3} 
            placeholder="Tuliskan Capaian Pembelajaran (CP) Umum atau biarkan kosong agar AI melaraskannya secara otomatis berdasarkan standar BSKAP No. 046/H/KR/2025 terbaru..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          {isLoading ? 'Sedang Memproses...' : `Generate Dokumen 1-6 (${bundleCost} Poin)`}
        </button>
      </div>
    </div>
  );
};
