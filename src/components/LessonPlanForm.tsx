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
  initialData?: LessonPlanInput | null;
}

const emptyForm: LessonPlanInput = {
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
};

export const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ onSubmit, isLoading, points, sessionCosts, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LessonPlanInput>(emptyForm);
  
  const [customPraktik, setCustomPraktik] = useState('');
  const [dynamicCost, setDynamicCost] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // This effect handles both setting template data and resetting the form.
    const dataToSet = initialData || emptyForm;
    setFormData(dataToSet);

    // Also check if the praktik pedagogis from the template is a custom one.
    const isCustom = !PRAKTIK_PEDAGOGIS_OPTIONS.includes(dataToSet.praktikPedagogis as any);
    if (isCustom) {
        setCustomPraktik(dataToSet.praktikPedagogis);
        setFormData(prev => ({ ...prev, praktikPedagogis: PRAKTIK_PEDAGOGIS_LAINNYA }));
    } else {
        setCustomPraktik('');
    }

    setStep(1); // Reset to the first step
    setErrors({}); // Clear any previous errors

  }, [initialData]);


  useEffect(() => {
    const numSessions = parseInt(formData.jumlahPertemuan) || 1;
    const costConfig = sessionCosts.find(sc => sc.sessions === numSessions);
    const calculatedCost = costConfig ? costConfig.cost : 0;
    setDynamicCost(calculatedCost);
  }, [formData.jumlahPertemuan, sessionCosts]);

  const hasEnoughPoints = points >= dynamicCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[e.target.name];
            return newErrors;
        });
    }
  };

  const handleCustomPraktikChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPraktik(e.target.value);
    if (errors.customPraktik) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.customPraktik;
            return newErrors;
        });
    }
  };
  
  const handleDimensionChange = (dimension: string) => {
    setFormData(prev => {
        const newDimensions = prev.dimensiProfilLulusan.includes(dimension)
            ? prev.dimensiProfilLulusan.filter(d => d !== dimension)
            : [...prev.dimensiProfilLulusan, dimension];
        return { ...prev, dimensiProfilLulusan: newDimensions };
    });
  };
  
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const validateStep = (stepToValidate: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (stepToValidate === 1) {
        if (!formData.mataPelajaran.trim()) { newErrors.mataPelajaran = 'Mata Pelajaran wajib diisi.'; isValid = false; }
        if (!formData.materi.trim()) { newErrors.materi = 'Materi wajib diisi.'; isValid = false; }
        if (!formData.jamPelajaran.trim() || Number(formData.jamPelajaran) <= 0) { newErrors.jamPelajaran = 'JP harus berupa angka positif.'; isValid = false; }
    } else if (stepToValidate === 2) {
        if (!formData.tujuanPembelajaran.trim()) { newErrors.tujuanPembelajaran = 'Tujuan Pembelajaran wajib diisi.'; isValid = false; }
        if (formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA && !customPraktik.trim()) {
            newErrors.customPraktik = 'Praktik Pedagogis kustom wajib diisi.'; isValid = false;
        }
    }
    setErrors(newErrors);
    return isValid;
  }

  const handleNextClick = () => {
    if (validateStep(step)) {
      nextStep();
    }
  };

  const handleFinalSubmit = () => {
    // Final validation for all required fields before submission
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    if (!isStep1Valid || !isStep2Valid) {
      // If validation fails, force user back to the first step with errors
      if (!isStep1Valid) setStep(1);
      else if (!isStep2Valid) setStep(2);
      return;
    }

    if (!hasEnoughPoints) return;
    
    const dataToSubmit = { ...formData };
    if (formData.praktikPedagogis === PRAKTIK_PEDAGOGIS_LAINNYA) {
        dataToSubmit.praktikPedagogis = customPraktik;
    }
    
    onSubmit(dataToSubmit);
  };

  const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-50";
  const labelClass = "block mb-2 text-sm font-medium text-sky-300";
  const fieldSetClass = "space-y-4";
  const stepTitles = ['Identitas Dasar', 'Desain Pembelajaran', 'Detail Tambahan (Opsional)'];
  const errorTextClass = "text-red-400 text-sm mt-1";


  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Langkah {step} dari 3: {stepTitles[step - 1]}</h2>
            <div className="flex w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div style={{ width: `${(step / 3) * 100}%` }} className="bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 ease-in-out rounded-full"></div>
            </div>
          </div>
        
          {step === 1 && (
            <fieldset className={fieldSetClass}>
              <div>
                <label htmlFor="mataPelajaran" className={labelClass}>Mata Pelajaran</label>
                <input type="text" name="mataPelajaran" id="mataPelajaran" value={formData.mataPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: Bahasa Indonesia, Matematika" />
                {errors.mataPelajaran && <p className={errorTextClass}>{errors.mataPelajaran}</p>}
              </div>
              <div>
                  <label htmlFor="kelasFase" className={labelClass}>Kelas/Fase</label>
                  <select name="kelasFase" id="kelasFase" value={formData.kelasFase} onChange={handleChange} className={inputClass} >
                      {KELAS_FASE_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                      ))}
                  </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="jumlahPertemuan" className={labelClass}>Jumlah Pertemuan</label>
                      <select name="jumlahPertemuan" id="jumlahPertemuan" value={formData.jumlahPertemuan} onChange={handleChange} className={inputClass} >
                          {JUMLAH_PERTEMUAN_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="jamPelajaran" className={labelClass}>JP per Pertemuan</label>
                      <input type="number" name="jamPelajaran" id="jamPelajaran" value={formData.jamPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: 2" min="1" />
                      {errors.jamPelajaran && <p className={errorTextClass}>{errors.jamPelajaran}</p>}
                  </div>
              </div>
              <div>
                <label htmlFor="materi" className={labelClass}>Materi</label>
                <input type="text" name="materi" id="materi" value={formData.materi} onChange={handleChange} className={inputClass} placeholder="Tuliskan topik pembelajaran" />
                {errors.materi && <p className={errorTextClass}>{errors.materi}</p>}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className={fieldSetClass}>
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
                <textarea name="tujuanPembelajaran" id="tujuanPembelajaran" value={formData.tujuanPembelajaran} onChange={handleChange} rows={4} className={inputClass} placeholder="Tuliskan tujuan pembelajaran yang mencakup kompetensi dan konten..." />
                {errors.tujuanPembelajaran && <p className={errorTextClass}>{errors.tujuanPembelajaran}</p>}
              </div>
               <div>
                <label htmlFor="praktikPedagogis" className={labelClass}>Praktik Pedagogis</label>
                <select name="praktikPedagogis" id="praktikPedagogis" value={formData.praktikPedagogis} onChange={handleChange} className={inputClass}>
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
                      onChange={handleCustomPraktikChange} 
                      className={inputClass} 
                      rows={2} 
                      placeholder="cth: Pembelajaran berbasis permainan (game-based learning)" 
                    />
                     {errors.customPraktik && <p className={errorTextClass}>{errors.customPraktik}</p>}
                  </div>
                )}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className={fieldSetClass}>
              <div>
                <label htmlFor="pesertaDidik" className={labelClass}>Peserta Didik <span className="text-slate-400 font-light">(Opsional)</span></label>
                <textarea name="pesertaDidik" id="pesertaDidik" value={formData.pesertaDidik} onChange={handleChange} rows={3} className={inputClass} placeholder="Identifikasi kesiapan, minat, atau kebutuhan belajar peserta didik..." />
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
            </fieldset>
          )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
        {step === 3 && !isLoading && (
            <div className="text-center mb-4">
                {!hasEnoughPoints && dynamicCost > 0 && (
                    <p className="text-red-400 text-sm">Poin Anda tidak cukup (butuh {dynamicCost} poin).</p>
                )}
            </div>
        )}
        <div className="flex justify-between items-center">
            <button 
              type="button" 
              onClick={prevStep}
              disabled={isLoading || step === 1}
              className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kembali
            </button>

            {step < 3 ? (
                <button 
                    type="button" 
                    onClick={handleNextClick}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                    Selanjutnya
                </button>
            ) : (
                <button 
                    type="button" 
                    onClick={handleFinalSubmit}
                    disabled={isLoading || !hasEnoughPoints || dynamicCost === 0} 
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
                        `Buat Modul Ajar (${dynamicCost > 0 ? `${dynamicCost} Poin` : '...'})`
                    )}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};