
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, GeneratedImage, LogoChoice } from './types.ts';
import { drawBauhausPattern } from './services/proceduralService.ts';
import { applyBranding, preloadLogos } from './services/brandingService.ts';
import { PALETTE } from './constants.ts';

const App: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [widthPx, setWidthPx] = useState<number>(1920);
  const [heightPx, setHeightPx] = useState<number>(1080);
  const [density, setDensity] = useState<number>(50); 
  const [dispersion, setDispersion] = useState<number>(50);
  const [centerExclusion, setCenterExclusion] = useState<number>(50);
  const [shapeSize, setShapeSize] = useState<number>(50);
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('auto');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // Pre-cargar logos oficiales al iniciar
  useEffect(() => {
    preloadLogos();
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setBrandingError(null);
    
    // Pequeño timeout para asegurar que el estado de carga se renderiza
    setTimeout(async () => {
      try {
        // 1. Generar base procedural (patrón Bauhaus)
        let patternUrl = drawBauhausPattern(
          widthPx, 
          heightPx, 
          selectedBgColor, 
          density, 
          dispersion, 
          centerExclusion, 
          shapeSize
        );
        
        let finalUrl = patternUrl;

        // 2. Intentar aplicar branding
        if (logoChoice !== 'none') {
          try {
            finalUrl = await applyBranding(patternUrl, logoChoice);
          } catch (brandErr: any) {
            // Si el logo falla, mantenemos la imagen sin logo (patternUrl)
            setBrandingError(brandErr.message);
            console.warn("Branding omitido por error de carga:", brandErr);
          }
        }

        setCurrentImage(finalUrl);
        
        const newImg: GeneratedImage = {
          id: Math.random().toString(36).substring(7),
          url: finalUrl,
          timestamp: Date.now(),
          aspectRatio: aspectRatio,
          dimensions: { width: widthPx, height: heightPx }
        };
        
        setHistory(prev => [newImg, ...prev].slice(0, 10));
      } catch (err) {
        console.error("Error crítico en motor de generación:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [aspectRatio, selectedBgColor, widthPx, heightPx, density, dispersion, centerExclusion, shapeSize, logoChoice]);

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#FDFCF7] lg:overflow-hidden">
      <Sidebar 
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        selectedBgColor={selectedBgColor}
        setSelectedBgColor={setSelectedBgColor}
        widthPx={widthPx}
        setWidthPx={setWidthPx}
        heightPx={heightPx}
        setHeightPx={setHeightPx}
        density={density}
        setDensity={setDensity}
        dispersion={dispersion}
        setDispersion={setDispersion}
        centerExclusion={centerExclusion}
        setCenterExclusion={setCenterExclusion}
        shapeSize={shapeSize}
        setShapeSize={setShapeSize}
        logoChoice={logoChoice}
        setLogoChoice={setLogoChoice}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        onOpenKeySelector={() => {}}
        hasCustomKey={true}
      />

      <main className="flex-1 flex flex-col bg-gray-50/40 relative min-h-[600px] lg:min-h-0 lg:overflow-hidden">
        {/* Banner Superior de Estado */}
        <div className="w-full bg-[#8E2464] py-1.5 px-4 text-center z-20 shrink-0 shadow-sm">
          <p className="text-[9px] text-white font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <i className="fa-solid fa-mobile-screen text-yellow-400 lg:hidden"></i>
            Procedural Engine v3.9 • Optimizado para Móvil
          </p>
        </div>

        {/* Notificación de Error de Branding */}
        {brandingError && (
          <div className="mx-8 mt-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 z-30 shadow-sm">
            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <i className="fa-solid fa-file-circle-exclamation text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-red-800 uppercase tracking-tight">Incidencia con el Logo</p>
              <p className="text-[10px] text-red-600 leading-tight">
                {brandingError} Se ha generado la imagen <b>sin logo</b>.
              </p>
            </div>
            <button 
              onClick={() => setBrandingError(null)} 
              className="text-red-400 hover:text-red-600 px-3 py-1 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-visible lg:overflow-hidden">
          <BackgroundPreview 
            imageUrl={currentImage} 
            isLoading={isLoading}
            aspectRatio={aspectRatio}
            width={widthPx}
            height={heightPx}
          />
        </div>

        {/* Historial de Generaciones */}
        {history.length > 1 && (
          <div className="shrink-0 bg-white/60 backdrop-blur-md border-t border-gray-100 p-4 z-10">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Recientes</span>
              <div className="flex gap-3 overflow-x-auto py-1 custom-scrollbar">
                {history.map((img) => (
                  <button 
                    key={img.id} 
                    onClick={() => setCurrentImage(img.url)} 
                    className={`relative shrink-0 rounded-lg overflow-hidden h-12 w-12 border-2 transition-all hover:scale-105 active:scale-95 ${currentImage === img.url ? 'border-[#8E2464] shadow-md ring-2 ring-[#8E2464]/20' : 'border-white'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
