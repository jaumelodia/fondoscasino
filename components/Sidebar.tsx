
import React, { useState, useEffect } from 'react';
import { ASPECT_RATIO_OPTIONS, PALETTE } from '../constants';
import { AspectRatio, LogoChoice } from '../types';

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
  onOpenKeySelector: () => void;
  hasCustomKey: boolean;
}

const PX_PER_CM = 118.11; // 300 DPI aproximado

const Sidebar: React.FC<SidebarProps> = ({ 
  aspectRatio, 
  setAspectRatio, 
  onGenerate, 
  isLoading,
  selectedBgColor,
  setSelectedBgColor,
  density,
  setDensity,
  dispersion,
  setDispersion,
  centerExclusion,
  setCenterExclusion,
  shapeSize,
  setShapeSize,
  logoChoice,
  setLogoChoice,
  logoX,
  setLogoX,
  logoY,
  setLogoY,
  logoScale,
  setLogoScale,
  onResetLogo,
  widthPx,
  setWidthPx,
  heightPx,
  setHeightPx
}) => {
  const [unit, setUnit] = useState<'px' | 'cm'>('px');
  const [localWidth, setLocalWidth] = useState<string>(widthPx.toString());
  const [localHeight, setLocalHeight] = useState<string>(heightPx.toString());

  // Sincronizar local con global cuando cambia el ratio o las dimensiones externas
  useEffect(() => {
    if (unit === 'px') {
      setLocalWidth(widthPx.toString());
      setLocalHeight(heightPx.toString());
    } else {
      setLocalWidth((widthPx / PX_PER_CM).toFixed(2));
      setLocalHeight((heightPx / PX_PER_CM).toFixed(2));
    }
  }, [widthPx, heightPx, unit]);

  const handleStandardRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    
    // Configuración de dimensiones y escala de logo por defecto
    if (ratio === '16:9') { 
      setWidthPx(1920); setHeightPx(1080); setLogoScale(12);
    }
    else if (ratio === '9:16') { 
      setWidthPx(1080); setHeightPx(1920); setLogoScale(20);
    }
    else if (ratio === '1:1') { 
      setWidthPx(1080); setHeightPx(1080); setLogoScale(12);
    }
    else if (ratio === '4:3') { 
      setWidthPx(1440); setHeightPx(1080); setLogoScale(12);
    }
    else if (ratio === '3:4') { 
      setWidthPx(1080); setHeightPx(1440); setLogoScale(20);
    }
    else if (ratio === 'A4') { 
      setWidthPx(2480); setHeightPx(3508); setLogoScale(20);
    }
  };

  const updateDimensions = (val: string, type: 'w' | 'h') => {
    const num = parseFloat(val);
    if (isNaN(num)) {
        if (type === 'w') setLocalWidth(val);
        else setLocalHeight(val);
        return;
    }

    const finalPx = unit === 'cm' ? Math.round(num * PX_PER_CM) : Math.round(num);
    
    if (type === 'w') {
        setLocalWidth(val);
        setWidthPx(finalPx);
    } else {
        setLocalHeight(val);
        setHeightPx(finalPx);
    }
    setAspectRatio('custom');
  };

  return (
    <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 h-auto lg:h-screen flex flex-col p-6 shadow-sm shrink-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8E2464] flex items-center justify-center text-white">
            <i className="fa-solid fa-music text-xl"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">Casino</h1>
            <h1 className="text-xl font-bold text-gray-800 leading-tight mt-[-4px]">Musical</h1>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar text-gray-700">
        {/* FORMATO */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">
            Formato de Imagen
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStandardRatioSelect(option.value)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 ${
                  aspectRatio === option.value
                    ? 'border-[#8E2464] bg-[#8E2464]/5 text-[#8E2464]'
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
              >
                <i className={`fa-solid ${option.icon || 'fa-crop-simple'} mb-1`}></i>
                <span className="font-bold text-[9px] uppercase">{option.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DIMENSIONES PERSONALIZADAS */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Medidas</label>
            <div className="flex bg-gray-200 p-0.5 rounded-lg">
              <button 
                onClick={() => setUnit('px')}
                className={`px-2 py-0.5 text-[8px] font-bold rounded-md transition-all ${unit === 'px' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
              >PX</button>
              <button 
                onClick={() => setUnit('cm')}
                className={`px-2 py-0.5 text-[8px] font-bold rounded-md transition-all ${unit === 'cm' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
              >CM</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">Ancho</label>
              <input 
                type="text" 
                value={localWidth}
                onChange={(e) => updateDimensions(e.target.value, 'w')}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8E2464] text-gray-700"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">Alto</label>
              <input 
                type="text" 
                value={localHeight}
                onChange={(e) => updateDimensions(e.target.value, 'h')}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8E2464] text-gray-700"
                placeholder="0"
              />
            </div>
          </div>
          {unit === 'cm' && (
             <p className="text-[7px] text-gray-400 italic">Conversión a 300 DPI para alta calidad.</p>
          )}
        </div>

        {/* EDITOR INTERACTIVO DEL LOGO */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 shadow-inner">
           <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-crosshairs"></i> Posición del Logo
              </label>
           </div>
          
          <div className="grid grid-cols-3 gap-1">
            {(['none', 'white', 'black'] as LogoChoice[]).map((choice) => (
              <button
                key={choice}
                onClick={() => setLogoChoice(choice)}
                className={`py-2 rounded-lg border-2 text-[8px] font-bold uppercase transition-all ${
                  logoChoice === choice 
                    ? 'border-[#8E2464] bg-[#8E2464] text-white' 
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                {choice === 'none' ? 'Sin Logo' : choice === 'white' ? 'Blanco' : 'Negro'}
              </button>
            ))}
          </div>

          {logoChoice !== 'none' && (
            <div className="space-y-4 pt-2 border-t border-gray-200">
               <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Margen X (Izq)</label>
                  <span className="text-[9px] font-black text-[#8E2464] bg-white px-2 py-0.5 rounded shadow-sm">{logoX}%</span>
                </div>
                <input type="range" min="0" max="100" step="0.1" value={logoX} onChange={(e) => setLogoX(parseFloat(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Margen Y (Sup)</label>
                  <span className="text-[9px] font-black text-[#8E2464] bg-white px-2 py-0.5 rounded shadow-sm">{logoY}%</span>
                </div>
                <input type="range" min="0" max="100" step="0.1" value={logoY} onChange={(e) => setLogoY(parseFloat(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Escala Logo</label>
                  <span className="text-[9px] font-black text-[#8E2464] bg-white px-2 py-0.5 rounded shadow-sm">{logoScale}%</span>
                </div>
                <input type="range" min="1" max="50" step="0.1" value={logoScale} onChange={(e) => setLogoScale(parseFloat(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
              </div>
              
              <button 
                onClick={onResetLogo}
                className="w-full py-3 bg-gradient-to-r from-[#8E2464] to-[#D97941] text-white rounded-xl text-[11px] font-black uppercase hover:shadow-lg hover:shadow-[#8E2464]/30 transition-all flex items-center justify-center gap-2 active:scale-95 border-2 border-white/20"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-[12px] animate-pulse"></i>
                RESETEAR (AUTO)
              </button>
            </div>
          )}
        </div>

        {/* COLOR FONDO */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">
            Color Base
          </label>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 justify-center">
            {Object.entries(PALETTE).map(([name, hex]) => (
              <button
                key={hex}
                onClick={() => setSelectedBgColor(hex)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-300 relative ${
                  selectedBgColor === hex 
                    ? 'border-[#8E2464] scale-110 shadow-md' 
                    : 'border-white hover:scale-105 shadow-sm'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* PARÁMETROS GENERATIVOS */}
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ajustes del Arte</label>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Densidad</label>
              <span className="text-[10px] font-bold text-gray-400">{density}%</span>
            </div>
            <input type="range" min="0" max="100" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Vacío Central</label>
              <span className="text-[10px] font-bold text-gray-400">{centerExclusion}%</span>
            </div>
            <input type="range" min="0" max="100" value={centerExclusion} onChange={(e) => setCenterExclusion(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"/>
          </div>
        </div>
      </div>

      {/* BOTÓN GENERAR ARTE (EXTRA) */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:shadow-black/10 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fa-solid fa-shuffle"></i>
          )}
          {isLoading ? 'Redibujando...' : 'Nueva Variación'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
