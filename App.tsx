
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
  const [density, setDensity] = useState<number>(50); 
  const [dispersion, setDispersion] = useState<number>(50);
  const [centerExclusion, setCenterExclusion] = useState<number>(50);
  const [shapeSize, setShapeSize] = useState<number>(50);
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('white');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    // Un pequeño delay para que la transición se sienta orgánica
    setTimeout(async () => {
      try {
        let url = drawBauhausPattern(
          widthPx, 
          heightPx, 
          selectedBgColor, 
          density, 
          dispersion, 
          centerExclusion, 
          shapeSize
        );
        
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
    }, 150);
  }, [aspectRatio, selectedBgColor, widthPx, heightPx, density, dispersion, centerExclusion, shapeSize, logoChoice]);

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#FDFCF7] overflow-hidden">
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

      <main className="flex-1 flex flex-col bg-gray-50/40 relative overflow-hidden">
        {/* Banner Superior Actualizado */}
        <div className="w-full bg-[#8E2464] py-1.5 px-4 text-center z-20 shrink-0 shadow-sm">
          <p className="text-[9px] text-white font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <i className="fa-solid fa-bolt text-yellow-400"></i>
            Procedural Engine v3.3 • Configuración Equilibrada al 50%
          </p>
        </div>

        {/* Área de Previsualización centradísima */}
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden">
          <BackgroundPreview 
            imageUrl={currentImage} 
            isLoading={isLoading}
            aspectRatio={aspectRatio}
            width={widthPx}
            height={heightPx}
          />
        </div>

        {/* Historial rápido */}
        {history.length > 1 && (
          <div className="shrink-0 bg-white/60 backdrop-blur-md border-t border-gray-100 p-4 z-10">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Historial</span>
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
