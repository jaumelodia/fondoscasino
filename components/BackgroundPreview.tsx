
import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio, TextConfig, LogoChoice } from '../types';
import { applyBranding } from '../services/brandingService';

interface BackgroundPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  textConfig: TextConfig;
  setTextConfig: (config: TextConfig) => void;
  basePatternUrl: string | null;
  logoChoice: LogoChoice;
  logoX: number;
  logoY: number;
  logoScale: number;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({ 
  imageUrl, 
  isLoading,
  textConfig,
  setTextConfig,
  basePatternUrl,
  logoChoice,
  logoX,
  logoY,
  logoScale
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startResizeSize, setStartResizeSize] = useState(0);
  const [startResizeDist, setStartResizeDist] = useState(0);

  // Estados para las guías visuales
  const [showVGuide, setShowVGuide] = useState(false);
  const [showHGuide, setShowHGuide] = useState(false);

  const getImageRect = () => {
    if (!imageRef.current) return null;
    return imageRef.current.getBoundingClientRect();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!textConfig.enabled || isLoading) return;
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = getImageRect();
    if (!rect) return;

    const centerX = (textConfig.x * rect.width) / 100 + rect.left;
    const centerY = (textConfig.y * rect.height) / 100 + rect.top;
    const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    
    setIsResizing(true);
    setStartResizeDist(dist);
    setStartResizeSize(textConfig.fontSize);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = getImageRect();
      if (!rect) return;

      if (isDragging) {
        let newX = ((e.clientX - rect.left) / rect.width) * 100;
        let newY = ((e.clientY - rect.top) / rect.height) * 100;
        
        // --- Lógica de Smart Guides y Snapping ---
        const snapThreshold = 1.2; // Umbral en % para activar el snap
        let snappingV = false;
        let snappingH = false;

        // Eje Vertical (Centro horizontal)
        if (Math.abs(newX - 50) < snapThreshold) {
          newX = 50;
          snappingV = true;
        }

        // Eje Horizontal (Centro vertical)
        if (Math.abs(newY - 50) < snapThreshold) {
          newY = 50;
          snappingH = true;
        }

        setShowVGuide(snappingV);
        setShowHGuide(snappingH);

        setTextConfig({ 
          ...textConfig, 
          x: Math.max(0, Math.min(100, newX)), 
          y: Math.max(0, Math.min(100, newY)) 
        });
      }

      if (isResizing) {
        const centerX = (textConfig.x * rect.width) / 100 + rect.left;
        const centerY = (textConfig.y * rect.height) / 100 + rect.top;
        const currentDist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        const scaleFactor = currentDist / startResizeDist;
        const newFontSize = Math.max(0.5, startResizeSize * scaleFactor);
        setTextConfig({ ...textConfig, fontSize: newFontSize });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setShowVGuide(false);
      setShowHGuide(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, textConfig, startResizeDist, startResizeSize]);

  const handleDownload = async () => {
    if (!basePatternUrl) return;
    try {
      const finalImageUrl = await applyBranding(
        basePatternUrl,
        logoChoice,
        logoX,
        logoY,
        logoScale,
        textConfig
      );
      
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `casino-musical-final-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Error al exportar:", err);
    }
  };

  const maxTextWidth = textConfig.enabled ? Math.min(textConfig.x, 100 - textConfig.x) * 2 : 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 lg:p-6 overflow-hidden" ref={containerRef}>
      <div className="relative w-full h-full flex items-center justify-center max-h-[calc(100vh-180px)] lg:max-h-full">
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-50 p-6 text-center rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 mb-4 border-4 border-[#8E2464]/10 border-t-[#8E2464] rounded-full animate-spin"></div>
            <p className="text-[#8E2464] font-bold text-xs tracking-widest uppercase">Generando composición...</p>
          </div>
        )}

        {imageUrl && (
          <div className="relative h-fit w-fit flex items-center justify-center select-none overflow-hidden shadow-2xl rounded-sm border border-gray-200">
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Fondo generado" 
              className={`max-w-full max-h-[80vh] lg:max-h-[85vh] w-auto h-auto object-contain transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
            />

            {/* GUÍAS INTELIGENTES VISUALES */}
            {isDragging && showVGuide && (
              <div className="absolute top-0 bottom-0 w-[1px] bg-[#8E2464] opacity-50 z-10 pointer-events-none" style={{ left: '50%' }} />
            )}
            {isDragging && showHGuide && (
              <div className="absolute left-0 right-0 h-[1px] bg-[#8E2464] opacity-50 z-10 pointer-events-none" style={{ top: '50%' }} />
            )}
            
            {/* CAPA DE TEXTO INTERACTIVO */}
            {textConfig.enabled && !isLoading && (
              <div 
                ref={textRef}
                onMouseDown={handleMouseDown}
                className="absolute cursor-move group select-none pointer-events-auto z-20"
                style={{
                  top: `${textConfig.y}%`,
                  left: `${textConfig.x}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 'fit-content',
                  maxWidth: `${maxTextWidth}%`,
                  textAlign: 'center'
                }}
              >
                <div className={`relative border-2 ${showVGuide || showHGuide ? 'border-[#8E2464]' : 'border-transparent'} group-hover:border-[#8b5cf6]/50 p-1 transition-colors duration-150`}>
                  <span 
                    className="font-limelight leading-[1.1] block break-words whitespace-pre-wrap"
                    style={{ 
                      fontSize: imageRef.current ? `${(textConfig.fontSize * imageRef.current.clientWidth) / 100}px` : '2rem',
                      color: textConfig.color === 'white' ? 'white' : 'black',
                    }}
                  >
                    {textConfig.content || 'Escribe algo...'}
                  </span>

                  {/* Tiradores con cursores específicos */}
                  <div onMouseDown={handleResizeStart} className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div onMouseDown={handleResizeStart} className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div onMouseDown={handleResizeStart} className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div onMouseDown={handleResizeStart} className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-[#8b5cf6] rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="absolute top-4 right-4 z-30">
                <button 
                  onClick={handleDownload}
                  className="bg-white/95 backdrop-blur text-gray-800 w-12 h-12 rounded-full shadow-xl hover:bg-[#8E2464] hover:text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  <i className="fa-solid fa-download text-lg"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundPreview;
