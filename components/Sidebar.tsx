
import React, { useEffect, useState } from 'react';
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
  dispersion: number;
  setDispersion: (val: number) => void;
  centerExclusion: number;
  setCenterExclusion: (val: number) => void;
  shapeSize: number;
  setShapeSize: (val: number) => void;
  logoChoice: LogoChoice;
  setLogoChoice: (choice: LogoChoice) => void;
  onOpenKeySelector: () => void;
  hasCustomKey: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  aspectRatio, 
  setAspectRatio, 
  onGenerate, 
  isLoading,
  selectedBgColor,
  setSelectedBgColor,
  widthPx,
  setWidthPx,
  heightPx,
  setHeightPx,
  dispersion,
  setDispersion,
  centerExclusion,
  setCenterExclusion,
  shapeSize,
  setShapeSize,
  logoChoice,
  setLogoChoice,
  onOpenKeySelector,
  hasCustomKey
}) => {
  const [isManual, setIsManual] = useState(false);

  const ratioValues: Record<AspectRatio, number> = {
    '1:1': 1,
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '4:3': 4 / 3,
    '3:4': 3 / 4,
    'A4': 210 / 297
  };

  const handlePixelChange = (dim: 'w' | 'h', val: number) => {
    const newW = dim === 'w' ? val : widthPx;
    const newH = dim === 'h' ? val : heightPx;
    
    if (dim === 'w') setWidthPx(val);
    else setHeightPx(val);

    const currentRatio = newW / newH;
    let closest: AspectRatio = '1:1';
    let minDiff = Infinity;

    (Object.keys(ratioValues) as AspectRatio[]).forEach((r) => {
      const diff = Math.abs(ratioValues[r as AspectRatio] - currentRatio);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r as AspectRatio;
      }
    });

    setAspectRatio(closest);
  };

  const handleStandardRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    setIsManual(false);
    if (ratio === '16:9') { setWidthPx(1920); setHeightPx(1080); }
    else if (ratio === '9:16') { setWidthPx(1080); setHeightPx(1920); }
    else if (ratio === '1:1') { setWidthPx(1080); setHeightPx(1080); }
    else if (ratio === '4:3') { setWidthPx(1440); setHeightPx(1080); }
    else if (ratio === '3:4') { setWidthPx(1080); setHeightPx(1440); }
    else if (ratio === 'A4') { setWidthPx(2480); setHeightPx(3508); } 
  };

  return (
    <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 h-auto lg:h-screen flex flex-col p-6 shadow-sm shrink-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8E2464] flex items-center justify-center text-white">
            <i className="fa-solid fa-music text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">Casino<br/>Musical</h1>
        </div>
        <button 
          onClick={onOpenKeySelector}
          title={hasCustomKey ? "Clave API configurada" : "Configurar Clave API"}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            hasCustomKey ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600 animate-pulse'
          }`}
        >
          <i className={`fa-solid ${hasCustomKey ? 'fa-key' : 'fa-circle-exclamation'}`}></i>
        </button>
      </div>

      <div className="space-y-6 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Formato / Ratio
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStandardRatioSelect(option.value)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                  aspectRatio === option.value && !isManual
                    ? 'border-[#8E2464] bg-[#8E2464]/5 text-[#8E2464]'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${option.icon || 'fa-crop-simple'} w-5 text-center`}></i>
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
           <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">
            Ajustes de Marca (Branding)
          </label>
          <div className="flex gap-2">
            {(['none', 'white', 'black'] as LogoChoice[]).map((choice) => (
              <button
                key={choice}
                onClick={() => setLogoChoice(choice)}
                className={`flex-1 py-2 px-1 rounded-lg border-2 text-[10px] font-bold uppercase transition-all ${
                  logoChoice === choice 
                    ? 'border-[#8E2464] bg-[#8E2464] text-white' 
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                {choice === 'none' ? 'Sin Logo' : choice === 'white' ? 'Blanco' : 'Negro'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
            Color de Fondo
          </label>
          <div className="flex flex-wrap gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 justify-center">
            {Object.entries(PALETTE).map(([name, hex]) => (
              <button
                key={hex}
                onClick={() => setSelectedBgColor(hex)}
                className={`w-9 h-9 rounded-full border-2 transition-all duration-300 relative ${
                  selectedBgColor === hex 
                    ? 'border-[#8E2464] scale-110 shadow-md' 
                    : 'border-white hover:scale-105 shadow-sm'
                }`}
                style={{ backgroundColor: hex }}
              >
                {selectedBgColor === hex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className={`fa-solid fa-check text-[10px] ${['#F1F3D5', '#F2B035', '#B1D7C3'].includes(hex) ? 'text-gray-800' : 'text-white'}`}></i>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
           <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase">Dispersión</label>
              <span className="text-[11px] font-bold text-[#8E2464]">{dispersion}%</span>
            </div>
            <input type="range" min="0" max="100" value={dispersion} onChange={(e) => setDispersion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase">Vacío Central</label>
              <span className="text-[11px] font-bold text-[#8E2464]">{centerExclusion}%</span>
            </div>
            <input type="range" min="0" max="100" value={centerExclusion} onChange={(e) => setCenterExclusion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-600 uppercase">Tamaño Formas</label>
              <span className="text-[11px] font-bold text-[#8E2464]">{shapeSize}%</span>
            </div>
            <input type="range" min="1" max="100" value={shapeSize} onChange={(e) => setShapeSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#8E2464] to-[#D97941] hover:shadow-[#8E2464]/20 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Generando...</span></> : <><i className="fa-solid fa-wand-magic-sparkles"></i><span>Generar Diseño</span></>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
