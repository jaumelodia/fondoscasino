
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, LogoChoice, TextConfig } from './types.ts';
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
  
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('white');
  const [logoX, setLogoX] = useState<number>(4);
  const [logoY, setLogoY] = useState<number>(4);
  const [logoScale, setLogoScale] = useState<number>(12);

  const [textConfig, setTextConfig] = useState<TextConfig>({
    enabled: false,
    content: 'Añade un texto',
    x: 50,
    y: 50,
    fontSize: 8,
    color: 'black'
  });

  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [basePatternUrl, setBasePatternUrl] = useState<string | null>(null); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  useEffect(() => { preloadLogos(); }, []);

  const handleResetLogo = useCallback(() => {
    setLogoX(4); setLogoY(4);
    const scale20Formats: AspectRatio[] = ['A4', '9:16', '3:4', '1:1'];
    setLogoScale(scale20Formats.includes(aspectRatio) ? 20 : 12);
  }, [aspectRatio]);

  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    setBrandingError(null);
    requestAnimationFrame(() => {
      try {
        const patternUrl = drawBauhausPattern(widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize);
        setBasePatternUrl(patternUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });
  }, [widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  // Regeneración automática cuando cambian los parámetros visuales (excepto dimensiones para evitar lag al escribir)
  useEffect(() => {
    handleGenerate();
  }, [selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  useEffect(() => {
    const updateLogoOverlay = async () => {
      if (!basePatternUrl) return;
      try {
        const finalUrl = await applyBranding(
          basePatternUrl, 
          logoChoice,
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
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
      {/* BARRA LATERAL (CONTROLES) */}
      <Sidebar 
        aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
        selectedBgColor={selectedBgColor} setSelectedBgColor={setSelectedBgColor}
        widthPx={widthPx} setWidthPx={setWidthPx} heightPx={heightPx} setHeightPx={setHeightPx}
        density={density} setDensity={setDensity} dispersion={dispersion} setDispersion={setDispersion}
        centerExclusion={centerExclusion} setCenterExclusion={setCenterExclusion}
        shapeSize={shapeSize} setShapeSize={setShapeSize}
        logoChoice={logoChoice} setLogoChoice={setLogoChoice}
        logoX={logoX} setLogoX={setLogoX} logoY={logoY} setLogoY={setLogoY}
        logoScale={logoScale} setLogoScale={setLogoScale}
        onResetLogo={handleResetLogo} onGenerate={handleGenerate}
        isLoading={isLoading} textConfig={textConfig} setTextConfig={setTextConfig}
      />

      {/* ESCRITORIO DE TRABAJO (LIENZO) */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-100/30">
        {/* CABECERA ESTILO APP PROFESIONAL */}
        <div className="w-full bg-[#8E2464] py-2.5 px-6 flex justify-between items-center shadow-lg z-20">
          <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Procedural Engine v6.3 • Full Studio Interaction</p>
          <div className="flex gap-4">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{widthPx} x {heightPx} px</span>
          </div>
        </div>

        {/* ÁREA DEL LIENZO */}
        <div className="flex-1 w-full flex items-center justify-center p-8 lg:p-12">
          <BackgroundPreview 
            imageUrl={currentImage} 
            isLoading={isLoading}
            aspectRatio={aspectRatio}
            width={widthPx}
            height={heightPx}
            textConfig={textConfig}
            setTextConfig={setTextConfig}
            basePatternUrl={basePatternUrl}
            logoChoice={logoChoice}
            logoX={logoX}
            logoY={logoY}
            logoScale={logoScale}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
