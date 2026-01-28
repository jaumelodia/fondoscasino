
import React, { useState } from 'react';
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
  setWidthPx,
  setHeightPx
}) => {
  const handleStandardRatioSelect = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
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
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">Casino</h1>
            <h1 className="text-xl font-bold text-gray-800 leading-tight mt-[-4px]">Musical</h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center" title="Motor Procedural Activo">
          <i className="fa-solid fa-bolt text-xs"></i>
        </div>
      </div>

      <div className="space-y-6 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">
            Formato / Ratio
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

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
           <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">
            Branding (Auto-Contraste)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'auto', 'white', 'black'] as LogoChoice[]).map((choice) => (
              <button
                key={choice}
                onClick={() => setLogoChoice(choice)}
                className={`py-2 px-1 rounded-lg border-2 text-[9px] font-bold uppercase transition-all ${
                  logoChoice === choice 
                    ? 'border-[#8E2464] bg-[#8E2464] text-white' 
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                {choice === 'none' ? 'Sin Logo' : choice === 'auto' ? 'Auto' : choice === 'white' ? 'Blanco' : 'Negro'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">
            Color de Fondo
          </label>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 justify-center">
            {Object.entries(PALETTE).map(([name, hex]) => (
              <button
                key={hex}
                onClick={() => setSelectedBgColor(hex)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative ${
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

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Densidad Figuras</label>
              <span className="text-[10px] font-bold text-[#8E2464]">{density}%</span>
            </div>
            <input type="range" min="0" max="100" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispersión</label>
              <span className="text-[10px] font-bold text-[#8E2464]">{dispersion}%</span>
            </div>
            <input type="range" min="0" max="100" value={dispersion} onChange={(e) => setDispersion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vacío Central</label>
              <span className="text-[10px] font-bold text-[#8E2464]">{centerExclusion}%</span>
            </div>
            <input type="range" min="0" max="100" value={centerExclusion} onChange={(e) => setCenterExclusion(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tamaño Formas</label>
              <span className="text-[10px] font-bold text-[#8E2464]">{shapeSize}%</span>
            </div>
            <input type="range" min="5" max="100" value={shapeSize} onChange={(e) => setShapeSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8E2464]"/>
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
          {isLoading ? <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Dibujando...</span></> : <><i className="fa-solid fa-wand-magic-sparkles"></i><span>Generar Diseño</span></>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
