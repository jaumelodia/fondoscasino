
import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio, TextConfig, LogoChoice, ShapeData } from '../types';
import { applyBranding, getLogoCanvas } from '../services/brandingService';

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
  shapes: ShapeData[];
  bgColor: string;
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
  logoScale,
  width,
  height,
  shapes,
  bgColor
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startResizeSize, setStartResizeSize] = useState(0);
  const [startResizeDist, setStartResizeDist] = useState(0);

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
        const snapThreshold = 1.2;
        let snappingV = false, snappingH = false;
        if (Math.abs(newX - 50) < snapThreshold) { newX = 50; snappingV = true; }
        if (Math.abs(newY - 50) < snapThreshold) { newY = 50; snappingH = true; }
        setShowVGuide(snappingV);
        setShowHGuide(snappingH);
        setTextConfig({ ...textConfig, x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
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

    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); setShowVGuide(false); setShowHGuide(false); };
    if (isDragging || isResizing) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging, isResizing, textConfig, startResizeDist, startResizeSize, setTextConfig]);

  const handleDownloadPNG = async () => {
    if (!shapes.length) return;
    try {
      // Para la descarga, usamos renderScale: 2.0 para una resolución HD / 4K real
      // Esto genera una imagen 2 veces más grande que la previsualización pero con la misma composición.
      const finalImageUrl = await applyBranding(
        width,
        height,
        bgColor,
        shapes,
        logoChoice,
        logoX,
        logoY,
        logoScale,
        textConfig,
        2.0 
      );
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `casino-musical-premium-hd-${width * 2}x${height * 2}-${Date.now()}.png`;
      link.click();
    } catch (err) { console.error("Error PNG:", err); }
  };

  const handleDownloadPDF = async () => {
    if (!shapes.length) return;
    try {
      const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1');
      const s = 0.75; 
      const widthPt = width * s;
      const heightPt = height * s;
      
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [widthPt, heightPt],
        compress: true
      });

      pdf.setFillColor(bgColor);
      pdf.rect(0, 0, widthPt, heightPt, 'F');

      const getRotatedPoint = (px: number, py: number, angle: number, tx: number, ty: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
          x: (px * cos - py * sin + tx) * s,
          y: (px * sin + py * cos + ty) * s
        };
      };

      shapes.forEach(shape => {
        pdf.setFillColor(shape.color);
        const w = shape.w;
        const h = shape.h;
        const rot = shape.rotation;
        const tx = shape.x;
        const ty = shape.y;

        if (shape.type === 'circle') {
          pdf.ellipse(tx * s, ty * s, (w / 2) * s, (w / 2) * s, 'F');
        } else {
          let points: {x: number, y: number}[] = [];

          if (shape.type === 'rect') {
            const rh = shape.isSquare ? w : h;
            points = [
              getRotatedPoint(-w / 2, -rh / 2, rot, tx, ty),
              getRotatedPoint(w / 2, -rh / 2, rot, tx, ty),
              getRotatedPoint(w / 2, rh / 2, rot, tx, ty),
              getRotatedPoint(-w / 2, rh / 2, rot, tx, ty),
            ];
          } else if (shape.type === 'triangle') {
            const triH = h * (Math.sqrt(3) / 2);
            points = [
              getRotatedPoint(0, -triH / 2, rot, tx, ty),
              getRotatedPoint(w / 2, triH / 2, rot, tx, ty),
              getRotatedPoint(-w / 2, triH / 2, rot, tx, ty),
            ];
          } else if (shape.type === 'trapezoid') {
            const tw = shape.topW || w * 0.5;
            points = [
              getRotatedPoint(-tw / 2, -h / 2, rot, tx, ty),
              getRotatedPoint(tw / 2, -h / 2, rot, tx, ty),
              getRotatedPoint(w / 2, h / 2, rot, tx, ty),
              getRotatedPoint(-w / 2, h / 2, rot, tx, ty),
            ];
          } else if (shape.type === 'rhombus') {
            points = [
              getRotatedPoint(0, -h / 2, rot, tx, ty),
              getRotatedPoint(w / 2, 0, rot, tx, ty),
              getRotatedPoint(0, h / 2, rot, tx, ty),
              getRotatedPoint(-w / 2, 0, rot, tx, ty),
            ];
          }

          if (points.length === 3) {
            pdf.triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, 'F');
          } else if (points.length === 4) {
            pdf.triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, 'F');
            pdf.triangle(points[0].x, points[0].y, points[2].x, points[2].y, points[3].x, points[3].y, 'F');
          }
        }
      });

      if (logoChoice !== 'none') {
        const logoCanvas = await getLogoCanvas(logoChoice as 'white' | 'black', 8);
        const logoTargetWidthPt = (widthPt * logoScale) / 100;
        const logoTargetHeightPt = logoTargetWidthPt * (logoCanvas.height / logoCanvas.width);
        const posXPt = (widthPt * logoX) / 100;
        const posYPt = (heightPt * logoY) / 100;
        
        pdf.addImage(
          logoCanvas.toDataURL('image/png'), 
          'PNG', 
          posXPt, 
          posYPt, 
          logoTargetWidthPt, 
          logoTargetHeightPt, 
          undefined, 
          'SLOW'
        );
      }

      if (textConfig.enabled && textConfig.content.trim()) {
        const fontSizePt = (widthPt * textConfig.fontSize) / 100;
        pdf.setTextColor(textConfig.color === 'white' ? '#FFFFFF' : '#000000');
        pdf.setFontSize(fontSizePt);
        
        const txPt = (widthPt * textConfig.x) / 100;
        const tyPt = (heightPt * textConfig.y) / 100;
        const lines = textConfig.content.split('\n');
        const lineHeight = fontSizePt * 1.1;
        const startY = tyPt - ((lines.length * lineHeight) / 2) + (lineHeight / 2);

        lines.forEach((line, i) => {
          pdf.text(line, txPt, startY + (i * lineHeight), { align: 'center' });
        });
      }

      pdf.save(`casino-musical-vector-design-${Date.now()}.pdf`);
    } catch (err) { 
      console.error("Error crítico durante la generación del PDF:", err);
      alert("Hubo un problema al generar el PDF vectorial. Por favor, intenta usar la descarga en PNG.");
    }
  };

  const maxTextWidth = textConfig.enabled ? Math.min(textConfig.x, 100 - textConfig.x) * 2 : 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none" ref={containerRef}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md z-50 rounded-3xl pointer-events-auto shadow-2xl">
          <div className="w-12 h-12 mb-4 border-4 border-[#8E2464]/10 border-t-[#8E2464] rounded-full animate-spin"></div>
          <p className="text-[#8E2464] font-black text-xs tracking-widest uppercase">Perfeccionando Diseño...</p>
        </div>
      )}

      {imageUrl && (
        <div 
          className={`relative transition-all duration-700 ease-in-out shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] pointer-events-auto ${isLoading ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}
          style={{ aspectRatio: `${width} / ${height}`, maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto' }}
        >
          <img ref={imageRef} src={imageUrl} alt="Procedural Art" className="w-full h-full block select-none pointer-events-none object-contain rounded-sm" />

          {isDragging && showVGuide && <div className="absolute top-0 bottom-0 w-[1px] bg-[#8E2464] opacity-50 z-10" style={{ left: '50%' }} />}
          {isDragging && showHGuide && <div className="absolute left-0 right-0 h-[1px] bg-[#8E2464] opacity-50 z-10" style={{ top: '50%' }} />}
          
          {textConfig.enabled && !isLoading && (
            <div 
              onMouseDown={handleMouseDown}
              className="absolute cursor-move group select-none pointer-events-auto z-20"
              style={{ top: `${textConfig.y}%`, left: `${textConfig.x}%`, transform: 'translate(-50%, -50%)', width: 'fit-content', maxWidth: `${maxTextWidth}%`, textAlign: 'center' }}
            >
              <div className={`relative border-2 ${isDragging ? 'border-[#8E2464]' : 'border-transparent'} group-hover:border-[#8E2464]/40 p-2 transition-all`}>
                <span className="font-limelight leading-[1.1] block break-words whitespace-pre-wrap" style={{ fontSize: imageRef.current ? `${(textConfig.fontSize * imageRef.current.clientWidth) / 100}px` : '2rem', color: textConfig.color === 'white' ? 'white' : 'black' }}>
                  {textConfig.content || 'Escribe algo...'}
                </span>
                <div onMouseDown={handleResizeStart} className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#8E2464] rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-md" />
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="absolute top-6 right-6 z-40 flex gap-3">
              <button onClick={handleDownloadPNG} title="Descargar Ultra PNG" className="bg-white/90 backdrop-blur-md text-[#1a1f2c] w-12 h-12 rounded-2xl shadow-2xl hover:bg-[#8E2464] hover:text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-white/50 group">
                <i className="fa-solid fa-image text-lg group-hover:animate-pulse"></i>
              </button>
              <button onClick={handleDownloadPDF} title="Descargar PDF Vectorial" className="bg-white/90 backdrop-blur-md text-[#1a1f2c] w-12 h-12 rounded-2xl shadow-2xl hover:bg-[#D97941] hover:text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-white/50 group">
                <i className="fa-solid fa-file-pdf text-lg group-hover:animate-pulse"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundPreview;
