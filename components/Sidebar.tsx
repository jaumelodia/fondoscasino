
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
  // Fix: Destructured missing dispersion and shapeSize properties from interface
  dispersion,
  setDispersion,
  shapeSize,
  setShapeSize,
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
      {/* LOGO EMPRESA - ACTUALIZADO A SVG OFICIAL - Tamaño reducido */}
      <div className="p-6 pb-2">
        <div className="w-full max-w-[150px] hover:opacity-80 transition-opacity cursor-default">
          <svg viewBox="0 0 1000 450" className="w-full h-auto">
            <path fill="#000000" d="M82.5 434.35c-31.76-5.1-58.28-24.14-72.26-51.87-1.67-3.31-4.32-10.06-5.88-15-2.7-8.5-2.86-9.95-2.85-26.98 0-19.41 1.16-25.92 6.95-39 11.02-24.93 40.37-48.66 65.65-53.08 9.54-1.67 32.91-1.96 40.39-.5 2.75.53 7.59 1.87 10.75 2.97l5.75 2 .17-31.69c.1-17.44.26-32.6.36-33.7s.25-26.98.33-57.51l.14-55.5 10.75-3.14c5.91-1.72 17.95-5.26 26.75-7.86 8.8-2.59 24.86-7.31 35.68-10.48l19.68-5.75 5.71 3.87c3.13 2.13 6.29 3.87 7.01 3.87s3.47-2.56 6.11-5.69c8-9.46 8.95-10.09 20.69-13.71 14.48-4.47 108.32-32.13 111.8-32.96 2.61-.63 2.7-.49 3.46 5.11.42 3.16.79 52.08.82 108.71l.04 102.97-13 4.09-13 4.1-11-5.21c-11.29-5.35-20.09-8.41-24.18-8.41H317v63c0 36.04.38 63 .89 63 .49 0 4.79-1.13 9.56-2.51 10.43-3.03 18.09-6.75 19.57-9.53 1.03-1.92 2.75-23 1.88-22.92-.22.02-4.23 1.31-8.9 2.88s-8.84 2.65-9.25 2.4c-.41-.24-.75-7.58-.75-16.31 0-14.25.18-15.93 1.75-16.4 10.65-3.18 47.14-13.61 47.62-13.61.35 0 .63 17.37.63 38.6 0 32.31-.25 39.12-1.51 41.77-2.84 6-25.82 19.41-40.52 23.66-9.13 2.63-29.23 3.71-39.47 2.12-11.46-1.79-25.77-7.1-34.96-12.99-9.82-6.28-22.84-18.92-29.55-28.68-21.8-31.68-20.36-77.55 3.39-108.3 13.81-17.89 32.38-29.92 54.62-35.4 11.92-2.94 30.05-2.92 42.74.06 5.08 1.19 10.33 2.16 11.66 2.16h2.41l.14-15.25c.08-8.39-.17-24.96-.55-36.83l-.69-21.58-13.1 3.88c-7.21 2.14-20.76 6.15-30.11 8.92-25.44 7.53-43.62 13.61-47.1 15.74-1.7 1.05-5.94 5.44-9.41 9.76s-6.88 8.48-7.57 9.24c-1.05 1.16-2.49.38-8.71-4.71l-7.46-6.1-13.59 3.88c-7.47 2.14-21.25 6.24-30.62 9.13L163 168.31v115.63l-5.25 1.49c-2.89.82-9.17 2.46-13.95 3.64l-8.7 2.15-10.3-5.1c-9.29-4.6-23.12-9.13-24.3-7.96-.25.26-.49 28.56-.52 62.9l-.07 62.44 2.8-.35c4.63-.57 14.28-4.18 23.52-8.79 4.8-2.4 9.31-4.36 10.01-4.36 1.25 0 20.6 7.45 26.01 10.02 1.51.71 2.75 1.73 2.75 2.26 0 3.04-20.93 18.82-31.72 23.91-11.97 5.65-21.64 7.89-35.78 8.3-6.6.19-13.35.13-15-.14"/>
            <text x="500" y="120" fontSize="110" fontFamily="Limelight" fill="#000000">Casino</text>
            <text x="500" y="260" fontSize="110" fontFamily="Limelight" fill="#000000">Musical</text>
            <text x="500" y="400" fontSize="110" fontFamily="Limelight" fill="#000000">Godella</text>
          </svg>
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
            {/* Added: Dispersion slider to UI */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Dispersión</span>
                <span className="text-[10px] font-bold text-gray-500">{dispersion}%</span>
              </div>
              <input type="range" min="0" max="100" value={dispersion} onChange={(e) => setDispersion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-[#8E2464] cursor-pointer"/>
            </div>
            {/* Added: Shape Size slider to UI */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Tamaño Formas</span>
                <span className="text-[10px] font-bold text-gray-500">{shapeSize}%</span>
              </div>
              <input type="range" min="0" max="100" value={shapeSize} onChange={(e) => setShapeSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-[#8E2464] cursor-pointer"/>
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

        {/* TEXTO */}
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
