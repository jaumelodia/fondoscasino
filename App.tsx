
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, GeneratedImage, LogoChoice } from './types.ts';
import { drawBauhausPattern } from './services/proceduralService.ts';
import { applyBranding } from './services/brandingService.ts';
import { PALETTE } from './constants.ts';

const App: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [widthPx, setWidthPx] = useState<number>(1920);
  const [heightPx, setHeightPx] = useState<number>(1080);
  const [dispersion, setDispersion] = useState<number>(60);
  const [centerExclusion, setCenterExclusion] = useState<number>(40);
  const [shapeSize, setShapeSize] = useState<number>(50);
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('white');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    // Pequeño timeout para feedback visual de carga instantánea
    setTimeout(async () => {
      try {
        // 1. Generación Procedural (Instantánea, sin API)
        let url = drawBauhausPattern(widthPx, heightPx, selectedBgColor, dispersion, centerExclusion, shapeSize);
        
        // 2. Aplicar Branding Inteligente (Auto-contraste disponible)
        if (logoChoice !== 'none') {
          url = await applyBranding(url, logoChoice as any);
        }

        setCurrentImage(url);
        
        const newImg: GeneratedImage = {
          id: Math.random().toString(36).substring(7),
          url: url,
          timestamp: Date.now(),
          aspectRatio: aspectRatio,
          dimensions: { width: widthPx, height: heightPx }
        };
        
        setHistory(prev => [newImg, ...prev].slice(0, 10));
      } catch (err) {
        console.error("Error en motor procedural:", err);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, [aspectRatio, selectedBgColor, widthPx, heightPx, dispersion, centerExclusion, shapeSize, logoChoice]);

  // Generar uno inicial
  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#FDFCF7] overflow-y-auto lg:overflow-hidden">
      <Sidebar 
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        selectedBgColor={selectedBgColor}
        setSelectedBgColor={setSelectedBgColor}
        widthPx={widthPx}
        setWidthPx={setWidthPx}
        heightPx={heightPx}
        setHeightPx={setHeightPx}
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

      <main className="flex-1 flex flex-col bg-gray-50/30 relative">
        <div className="w-full bg-indigo-600 py-2 px-4 text-center z-10 sticky top-0">
          <p className="text-[10px] text-white font-bold tracking-widest uppercase flex items-center justify-center gap-2">
            <i className="fa-solid fa-bolt"></i>
            Motor Procedural V2: Generación Instantánea & Branding Adaptativo
          </p>
        </div>

        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col p-4 lg:p-8">
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <BackgroundPreview 
              imageUrl={currentImage} 
              isLoading={isLoading}
              aspectRatio={aspectRatio}
              width={widthPx}
              height={heightPx}
            />
          </div>

          {history.length > 0 && (
            <div className="mt-8 shrink-0 pb-10 lg:pb-0 overflow-hidden">
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Variaciones</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 px-1">
                {history.map((img) => (
                  <button key={img.id} onClick={() => setCurrentImage(img.url)} className={`relative shrink-0 rounded-xl overflow-hidden h-16 w-16 border-2 transition-all ${currentImage === img.url ? 'border-indigo-600 scale-105' : 'border-white'}`}>
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
