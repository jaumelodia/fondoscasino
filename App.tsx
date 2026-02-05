
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
  
  // Margen por defecto: 4%, 4%
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('white');
  const [logoX, setLogoX] = useState<number>(4);
  const [logoY, setLogoY] = useState<number>(4);
  const [logoScale, setLogoScale] = useState<number>(12); // Inicial para 16:9

  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [basePatternUrl, setBasePatternUrl] = useState<string | null>(null); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  // Pre-cargar logos al iniciar
  useEffect(() => {
    preloadLogos();
  }, []);

  const handleResetLogo = useCallback(() => {
    setLogoX(4);
    setLogoY(4);
    
    // Escala por defecto contextual
    const verticalFormats: AspectRatio[] = ['A4', '9:16', '3:4'];
    setLogoScale(verticalFormats.includes(aspectRatio) ? 20 : 12);
  }, [aspectRatio]);

  // Función para generar SOLO el fondo procedural
  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    setBrandingError(null);
    
    // Usamos requestAnimationFrame para asegurar que el UI no se bloquee antes del renderizado de canvas pesado
    requestAnimationFrame(() => {
      try {
        const patternUrl = drawBauhausPattern(
          widthPx, 
          heightPx, 
          selectedBgColor, 
          density, 
          dispersion, 
          centerExclusion, 
          shapeSize
        );
        setBasePatternUrl(patternUrl);
      } catch (err) {
        console.error("Error en motor procedural:", err);
      } finally {
        setIsLoading(false);
      }
    });
  }, [widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  // AUTO-GENERACIÓN: La imagen responde inmediatamente a CUALQUIER cambio en los parámetros artísticos
  useEffect(() => {
    handleGenerate();
  }, [widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  // TIEMPO REAL LOGO: Aplica el logo cuando cambian los sliders de marca
  useEffect(() => {
    const updateLogoOverlay = async () => {
      if (!basePatternUrl) return;

      if (logoChoice === 'none') {
        setCurrentImage(basePatternUrl);
        return;
      }

      try {
        const finalUrl = await applyBranding(
          basePatternUrl, 
          logoChoice as 'white' | 'black',
          logoX,
          logoY,
          logoScale
        );
        setCurrentImage(finalUrl);
      } catch (err: any) {
        setBrandingError(err.message);
        setCurrentImage(basePatternUrl);
      }
    };

    updateLogoOverlay();
  }, [basePatternUrl, logoChoice, logoX, logoY, logoScale]);

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
        logoX={logoX}
        setLogoX={setLogoX}
        logoY={logoY}
        setLogoY={setLogoY}
        logoScale={logoScale}
        setLogoScale={setLogoScale}
        onResetLogo={handleResetLogo}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        onOpenKeySelector={() => {}}
        hasCustomKey={true}
      />

      <main className="flex-1 flex flex-col bg-gray-50/40 relative min-h-[600px] lg:min-h-0 lg:overflow-hidden">
        <div className="w-full bg-[#8E2464] py-1.5 px-4 text-center z-20 shrink-0 shadow-sm">
          <p className="text-[9px] text-white font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            Procedural Engine v5.2 • Full Live Interaction
          </p>
        </div>

        {brandingError && (
          <div className="mx-8 mt-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-4 z-30 shadow-sm">
            <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <p className="text-[10px] text-red-600 leading-tight flex-1">{brandingError}</p>
            <button onClick={() => setBrandingError(null)} className="text-red-400"><i className="fa-solid fa-xmark"></i></button>
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
      </main>
    </div>
  );
};

export default App;
