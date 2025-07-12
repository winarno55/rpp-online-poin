import React, { useState, useEffect } from 'react';
import { LessonPlanInput } from '../types';
import { JUMLAH_PERTEMUAN_OPTIONS, DIMENSI_PROFIL_LULUSAN, PRAKTIK_PEDAGOGIS_OPTIONS, KELAS_FASE_OPTIONS, PRAKTIK_PEDAGOGIS_LAINNYA } from '../constants';

interface SessionCost {
  sessions: number;
  cost: number;
}
interface LessonPlanFormProps {
  onSubmit: (data: LessonPlanInput) => void;
  isLoading: boolean;
  points: number;
  sessionCosts: SessionCost[];
}

export const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ onSubmit, isLoading, points, sessionCosts }) => {
  const [formData, setFormData] = useState<LessonPlanInput>({
    mataPelajaran: '',
    kelasFase: KELAS_FASE_OPTIONS[0],
    materi: '',
    jumlahPertemuan: JUMLAH_PERTEMUAN_OPTIONS[0],
    jamPelajaran: '',
    pesertaDidik: '',
    dimensiProfilLulusan: [],
    capaianPembelajaran: '',
    lintasDisiplinIlmu: '',
    tujuanPembelajaran: '',
    praktikPedagogis: PRAKTIK_PEDAGOGIS_OPTIONS[0],
    lingkunganPembelajaran: '',
    pemanfaatanDigital: '',
    kemitraanPembelajaran: '',
  });
  
  const [customPraktik, setCustomPraktik] = useState('');
  const [dynamicCost, setDynamicCost] = useState(0);

  useEffect(() => {
    const numSessions = parseInt(formData.jumlahPertemuan) || 1;
    const costConfig = sessionCosts.find(sc => sc.sessions === numSessions);
    const calculatedCost = costConfig ? costConfig.cost : 0;
    setDynamicCost(calculatedCost);
  }, [formData.jumlahPertemuan, sessionCosts]);

  const hasEnoughPoints = points >= dynamicCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDimensionChange = (dimension: string) => {
    setFormData(prev => {
        const newDimensions = prev.dimensiProfilLulusan.includes(dimension)
            ? prev.dimensiProfilLulusan.filter(d => d !== dimension)
            : [...prev.dimensiProfilLulusan, dimension];
        return { ...prev, dimensiProfilLulusan: newDimensions };
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEnoughPoints) return;
    
    const dataToSubmit = { ...formData };
    if (formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA) {
        dataToSubmit.praktikPedagogis = customPraktik;
    }
    
    onSubmit(dataToSubmit);
  };

  const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-50";
  const labelClass = "block mb-2 text-sm font-medium text-sky-300";
  const fieldSetClass = "space-y-4 border-b border-slate-700 pb-6 mb-6";
  const headingClass = "text-xl font-semibold text-white mb-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className={fieldSetClass}>
        <h3 className={headingClass}>Identitas</h3>
        <div>
          <label htmlFor="mataPelajaran" className={labelClass}>Mata Pelajaran</label>
          <input type="text" name="mataPelajaran" id="mataPelajaran" value={formData.mataPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: Bahasa Indonesia, Matematika" required />
        </div>
        <div>
            <label htmlFor="kelasFase" className={labelClass}>Kelas/Fase</label>
            <select name="kelasFase" id="kelasFase" value={formData.kelasFase} onChange={handleChange} className={inputClass} required>
                {KELAS_FASE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="jumlahPertemuan" className={labelClass}>Jumlah Pertemuan</label>
                <select name="jumlahPertemuan" id="jumlahPertemuan" value={formData.jumlahPertemuan} onChange={handleChange} className={inputClass} required>
                    {JUMLAH_PERTEMUAN_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="jamPelajaran" className={labelClass}>JP per Pertemuan</label>
                <input type="number" name="jamPelajaran" id="jamPelajaran" value={formData.jamPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: 2" required min="1" />
            </div>
        </div>
        <div>
          <label htmlFor="materi" className={labelClass}>Materi</label>
          <input type="text" name="materi" id="materi" value={formData.materi} onChange={handleChange} className={inputClass} placeholder="Tuliskan topik pembelajaran" required />
        </div>
        <div>
          <label htmlFor="pesertaDidik" className={labelClass}>Peserta Didik <span className="text-slate-400 font-light">(Opsional)</span></label>
          <textarea name="pesertaDidik" id="pesertaDidik" value={formData.pesertaDidik} onChange={handleChange} rows={3} className={inputClass} placeholder="Identifikasi kesiapan, minat, atau kebutuhan belajar peserta didik..." />
        </div>
      </div>

      <div className={fieldSetClass}>
        <h3 className={headingClass}>Identifikasi Desain Pembelajaran</h3>
        <div>
            <label className={labelClass}>Dimensi Profil Lulusan</label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {DIMENSI_PROFIL_LULUSAN.map(dim => (
                    <label key={dim} className="flex items-center space-x-2 text-slate-200 cursor-pointer">
                        <input type="checkbox"
                            className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-sky-500 focus:ring-sky-600"
                            value={dim}
                            checked={formData.dimensiProfilLulusan.includes(dim)}
                            onChange={() => handleDimensionChange(dim)}
                        />
                        <span>{dim}</span>
                    </label>
                ))}
            </div>
        </div>
        <div>
          <label htmlFor="capaianPembelajaran" className={labelClass}>Capaian Pembelajaran <span className="text-slate-400 font-light">(Opsional)</span></label>
          <textarea name="capaianPembelajaran" id="capaianPembelajaran" value={formData.capaianPembelajaran} onChange={handleChange} rows={3} className={inputClass} placeholder="Tuliskan capaian pembelajaran sesuai fase..." />
        </div>
        <div>
          <label htmlFor="tujuanPembelajaran" className={labelClass}>Tujuan Pembelajaran</label>
          <textarea name="tujuanPembelajaran" id="tujuanPembelajaran" value={formData.tujuanPembelajaran} onChange={handleChange} rows={4} className={inputClass} placeholder="Tuliskan tujuan pembelajaran yang mencakup kompetensi dan konten..." required />
        </div>
         <div>
          <label htmlFor="praktikPedagogis" className={labelClass}>Praktik Pedagogis</label>
          <select name="praktikPedagogis" id="praktikPedagogis" value={formData.praktikPedagogis} onChange={handleChange} className={inputClass} required>
            {PRAKTIK_PEDAGOGIS_OPTIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA && (
            <div className="mt-4">
              <label htmlFor="customPraktik" className={labelClass}>Tuliskan Praktik Pedagogis Pilihan Anda</label>
              <textarea 
                id="customPraktik" 
                name="customPraktik" 
                value={customPraktik} 
                onChange={(e) => setCustomPraktik(e.target.value)} 
                className={inputClass} 
                rows={2} 
                placeholder="cth: Pembelajaran berbasis permainan (game-based learning)" 
                required 
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="lintasDisiplinIlmu" className={labelClass}>Lintas Disiplin Ilmu <span className="text-slate-400 font-light">(Opsional)</span></label>
          <input type="text" name="lintasDisiplinIlmu" id="lintasDisiplinIlmu" value={formData.lintasDisiplinIlmu} onChange={handleChange} className={inputClass} placeholder="cth: Sosiologi, Ekonomi" />
        </div>
         <div>
          <label htmlFor="lingkunganPembelajaran" className={labelClass}>Lingkungan Pembelajaran <span className="text-slate-400 font-light">(Opsional)</span></label>
          <textarea name="lingkunganPembelajaran" id="lingkunganPembelajaran" value={formData.lingkunganPembelajaran} onChange={handleChange} rows={3} className={inputClass} placeholder="Jelaskan budaya belajar atau ruang fisik/virtual yang diinginkan..." />
        </div>
         <div>
          <label htmlFor="pemanfaatanDigital" className={labelClass}>Pemanfaatan Digital <span className="text-slate-400 font-light">(Opsional)</span></label>
          <textarea name="pemanfaatanDigital" id="pemanfaatanDigital" value={formData.pemanfaatanDigital} onChange={handleChange} rows={3} className={inputClass} placeholder="cth: Video pembelajaran, platform, perpustakaan digital..." />
        </div>
        <div>
          <label htmlFor="kemitraanPembelajaran" className={labelClass}>Kemitraan Pembelajaran <span className="text-slate-400 font-light">(Opsional)</span></label>
          <textarea name="kemitraanPembelajaran" id="kemitraanPembelajaran" value={formData.kemitraanPembelajaran} onChange={handleChange} rows={3} className={inputClass} placeholder="cth: Kolaborasi dengan guru mapel lain, orang tua, komunitas..." />
        </div>
      </div>


      <button 
        type="submit" 
        disabled={isLoading || !hasEnoughPoints || dynamicCost === 0} 
        className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
          `Buat Modul Ajar (Biaya: ${dynamicCost > 0 ? dynamicCost : '...'} Poin)`
        )}
      </button>
      {!hasEnoughPoints && !isLoading && dynamicCost > 0 && (
        <p className="text-center text-red-400 mt-2">Poin tidak cukup (butuh {dynamicCost} poin).</p>
      )}
    </form>
  );
};