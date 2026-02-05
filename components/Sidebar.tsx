
import React, { useState } from 'react';
import { ASPECT_RATIO_OPTIONS, PALETTE } from '../constants';
import { AspectRatio, LogoChoice, TextConfig } from '../types';

interface SidebarProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedBgColor: string;
  setSelectedBgColor: (color: string) => void;
  widthPx: number;
  setWidthPx: (w: number) => void;
  heightPx: number;
  setHeightPx: (h: number) => void;
  density: number;
  setDensity: (val: number) => void;
  dispersion: number;
  setDispersion: (val: number) => void;
  centerExclusion: number;
  setCenterExclusion: (val: number) => void;
  shapeSize: number;
  setShapeSize: (val: number) => void;
  logoChoice: LogoChoice;
  setLogoChoice: (choice: LogoChoice) => void;
  logoX: number;
  setLogoX: (val: number) => void;
  logoY: number;
  setLogoY: (val: number) => void;
  logoScale: number;
  setLogoScale: (val: number) => void;
  onResetLogo: () => void;
  textConfig: TextConfig;
  setTextConfig: (config: TextConfig) => void;
}

const PX_PER_CM = 118.11;

const Sidebar: React.FC<SidebarProps> = ({ 
  aspectRatio, 
  setAspectRatio, 
  onGenerate, 
  isLoading,
  selectedBgColor,
  setSelectedBgColor,
  logoChoice,
  setLogoChoice,
  onResetLogo,
  widthPx,
  setWidthPx,
  heightPx,
  setHeightPx,
  logoX,
  setLogoX,
  logoY,
  setLogoY,
  logoScale,
  setLogoScale,
  density,
  setDensity,
  centerExclusion,
  setCenterExclusion,
  textConfig,
  setTextConfig
}) => {
  const [unit, setUnit] = useState<'px' | 'cm'>('px');

  const handleStandardRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    
    // Ajustar dimensiones
    if (ratio === '16:9') { setWidthPx(1920); setHeightPx(1080); }
    else if (ratio === '9:16') { setWidthPx(1080); setHeightPx(1920); }
    else if (ratio === '1:1') { setWidthPx(1080); setHeightPx(1080); }
    else if (ratio === '4:3') { setWidthPx(1440); setHeightPx(1080); }
    else if (ratio === '3:4') { setWidthPx(1080); setHeightPx(1440); }
    else if (ratio === 'A4') { setWidthPx(2480); setHeightPx(3508); }

    // Ajustar escala de logo por defecto
    // Horizontal (16:9) y Clásico (4:3) -> 12%
    // Otros -> 20%
    if (ratio === '16:9' || ratio === '4:3') {
      setLogoScale(12);
    } else {
      setLogoScale(20);
    }
  };

  const handleWidthChange = (val: string) => {
    const num = parseFloat(val) || 0;
    setWidthPx(unit === 'px' ? num : Math.round(num * PX_PER_CM));
  };

  const handleHeightChange = (val: string) => {
    const num = parseFloat(val) || 0;
    setHeightPx(unit === 'px' ? num : Math.round(num * PX_PER_CM));
  };

  const displayWidth = unit === 'px' ? widthPx : (widthPx / PX_PER_CM).toFixed(1);
  const displayHeight = unit === 'px' ? heightPx : (heightPx / PX_PER_CM).toFixed(1);

  return (
    <div className="w-full lg:w-[340px] bg-white border-r border-gray-100 h-screen flex flex-col shadow-xl z-30 relative shrink-0">
      {/* LOGO EMPRESA */}
      <div className="p-6 pb-2 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#8E2464] flex items-center justify-center text-white shadow-lg shadow-[#8E2464]/20">
          <i className="fa-solid fa-music text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">Casino</h1>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">Musical</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
        
        {/* FORMATO (Botones con iconos) */}
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStandardRatioSelect(opt.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                aspectRatio === opt.value 
                  ? 'border-[#8E2464] bg-[#8E2464]/5 text-[#8E2464]' 
                  : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'
              }`}
            >
              <i className={`fa-solid ${opt.icon} text-lg mb-1.5`}></i>
              <span className="text-[8px] font-black uppercase tracking-widest">{opt.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* MEDIDAS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medidas</span>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setUnit('px')} className={`px-3 py-1 text-[9px] font-bold rounded-lg transition-all ${unit === 'px' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>PX</button>
              <button onClick={() => setUnit('cm')} className={`px-3 py-1 text-[9px] font-bold rounded-lg transition-all ${unit === 'cm' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>CM</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[8px] font-bold text-gray-300 uppercase mb-1 ml-1">Ancho</label>
              <input type="number" value={displayWidth} onChange={(e) => handleWidthChange(e.target.value)} className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8E2464]/10 transition-all"/>
            </div>
            <div>
              <label className="block text-[8px] font-bold text-gray-300 uppercase mb-1 ml-1">Alto</label>
              <input type="number" value={displayHeight} onChange={(e) => handleHeightChange(e.target.value)} className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8E2464]/10 transition-all"/>
            </div>
          </div>
        </div>

        {/* LOGO PRESETS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-crosshairs text-[10px] text-gray-300"></i>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posición del Logo</span>
          </div>
          <div className="flex gap-2">
            {(['none', 'white', 'black'] as LogoChoice[]).map((c) => (
              <button
                key={c}
                onClick={() => setLogoChoice(c)}
                className={`flex-1 py-3 rounded-xl border text-[9px] font-bold uppercase transition-all ${
                  logoChoice === c ? 'bg-[#8E2464] border-[#8E2464] text-white shadow-md' : 'bg-gray-50 border-gray-50 text-gray-400'
                }`}
              >
                {c === 'none' ? 'Sin Logo' : c === 'white' ? 'Blanco' : 'Negro'}
              </button>
            ))}
          </div>

          {logoChoice !== 'none' && (
            <div className="space-y-5">
              {[
                { label: 'Margen X (Izq)', val: logoX, set: setLogoX },
                { label: 'Margen Y (Sup)', val: logoY, set: setLogoY },
                { label: 'Escala Logo', val: logoScale, set: setLogoScale }
              ].map((s) => (
                <div key={s.label} className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{s.label}</span>
                    <span className="text-[10px] font-black text-[#8E2464]">{s.val}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={s.val} onChange={(e) => s.set(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
                </div>
              ))}
              <button onClick={onResetLogo} className="w-full py-4 bg-gradient-to-r from-[#8E2464] to-[#D97941] text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-[#8E2464]/20 flex items-center justify-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles"></i> Resetear (Auto)
              </button>
            </div>
          )}
        </div>

        {/* COLOR BASE */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Color Base</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(PALETTE).map(([name, hex]) => (
              <button
                key={hex}
                onClick={() => setSelectedBgColor(hex)}
                className={`w-9 h-9 rounded-full border-4 transition-all ${selectedBgColor === hex ? 'border-[#8E2464] scale-110 shadow-lg' : 'border-white hover:scale-105'}`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* AJUSTES DEL ARTE */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ajustes del Arte</span>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Densidad</span>
                <span className="text-[10px] font-bold text-gray-500">{density}%</span>
              </div>
              <input type="range" min="0" max="100" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-[#8E2464] cursor-pointer"/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Vacío Central</span>
                <span className="text-[10px] font-bold text-gray-500">{centerExclusion}%</span>
              </div>
              <input type="range" min="0" max="100" value={centerExclusion} onChange={(e) => setCenterExclusion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-[#8E2464] cursor-pointer"/>
            </div>
          </div>
        </div>

        {/* TEXTO (Solo si está habilitado) */}
        <div className={`rounded-3xl border p-5 transition-all ${textConfig.enabled ? 'bg-purple-50 border-purple-100 shadow-sm' : 'bg-gray-50 border-gray-50 opacity-60'}`}>
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <i className="fa-solid fa-font text-[10px] text-purple-400"></i>
               <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Capa de Texto</span>
             </div>
             <button onClick={() => setTextConfig({...textConfig, enabled: !textConfig.enabled})} className={`w-9 h-5 rounded-full relative transition-all ${textConfig.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}>
               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${textConfig.enabled ? 'left-5' : 'left-1'}`} />
             </button>
          </div>
          {textConfig.enabled && (
            <div className="space-y-3 animate-fade-in">
              <textarea 
                rows={2} 
                value={textConfig.content} 
                onChange={(e) => setTextConfig({...textConfig, content: e.target.value})} 
                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-xs font-limelight text-gray-800 outline-none focus:ring-2 focus:ring-purple-200 resize-none shadow-inner placeholder-purple-200" 
                placeholder="Texto aquí..."
              />
              <div className="flex gap-2">
                {(['black', 'white'] as const).map(c => (
                  <button key={c} onClick={() => setTextConfig({...textConfig, color: c})} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded-xl border transition-all ${textConfig.color === c ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-purple-100 text-purple-400'}`}>
                    {c === 'white' ? 'Blanco' : 'Negro'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN GENERAR FIJO */}
      <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-black text-white text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#1a1f2c] hover:bg-black active:scale-[0.98] shadow-xl shadow-gray-200'}`}
        >
          {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <><i className="fa-solid fa-shuffle"></i> Nueva Variación</>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
