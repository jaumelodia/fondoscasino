
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, LogoChoice, TextConfig, ShapeData } from './types.ts';
import { drawBauhausPattern } from './services/proceduralService.ts';
import { applyBranding, preloadLogos } from './services/brandingService.ts';
import { PALETTE } from './constants.ts';

// Main Application Component
const App: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [widthPx, setWidthPx] = useState<number>(1920);
  const [heightPx, setHeightPx] = useState<number>(1080);
  const [density, setDensity] = useState<number>(50); 
  const [dispersion, setDispersion] = useState<number>(50);
  const [centerExclusion, setCenterExclusion] = useState<number>(50);
  const [shapeSize, setShapeSize] = useState<number>(50);
  
  const [logoChoice, setLogoChoice] = useState<LogoChoice>('black');
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
  const [currentShapes, setCurrentShapes] = useState<ShapeData[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // Preload branding assets for high-performance canvas operations
  useEffect(() => { preloadLogos(); }, []);

  // Reset logo position and scale based on standard aspect ratios
  const handleResetLogo = useCallback(() => {
    setLogoX(4); setLogoY(4);
    const scale20Formats: AspectRatio[] = ['A4', '9:16', '3:4', '1:1'];
    setLogoScale(scale20Formats.includes(aspectRatio) ? 20 : 12);
  }, [aspectRatio]);

  // Generate new variation using the procedural Bauhaus engine
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      // Small artificial delay to provide visual feedback during generation
      await new Promise(r => setTimeout(r, 600));
      const result = drawBauhausPattern(
        widthPx,
        heightPx,
        selectedBgColor,
        density,
        dispersion,
        centerExclusion,
        shapeSize
      );
      setBasePatternUrl(result.url);
      setCurrentShapes(result.shapes);
    } catch (error) {
      console.error("Error generating pattern:", error);
    } finally {
      setIsLoading(false);
    }
  }, [widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  // Sync the currentImage with the pattern + branding overlay
  useEffect(() => {
    const updateLogoOverlay = async () => {
      if (!currentShapes.length) return;
      try {
        const finalUrl = await applyBranding(
          widthPx,
          heightPx,
          selectedBgColor,
          currentShapes,
          logoChoice,
          logoX,
          logoY,
          logoScale,
          { ...textConfig, enabled: false } // Text is rendered by HTML overlay in preview
        );
        setCurrentImage(finalUrl);
      } catch (err: any) {
        console.error("Error applying branding to preview:", err);
        if (basePatternUrl) setCurrentImage(basePatternUrl);
      }
    };
    updateLogoOverlay();
  }, [currentShapes, logoChoice, logoX, logoY, logoScale, selectedBgColor, widthPx, heightPx, basePatternUrl]);

  // Trigger initial pattern generation on mount
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      {/* Mobile Menu Floating Action Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1a1f2c] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90"
      >
        <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
      </button>

      {/* Sidebar Navigation and Configuration */}
      <div className={`fixed inset-0 z-40 lg:relative lg:flex transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar 
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onGenerate={handleGenerate}
          isLoading={isLoading}
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
          textConfig={textConfig}
          setTextConfig={setTextConfig}
        />
        {/* Mobile Backdrop Overlay */}
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className={`lg:hidden absolute inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        />
      </div>

      {/* Primary Preview Main Region */}
      <main className="flex-1 relative p-4 lg:p-12 flex items-center justify-center overflow-hidden">
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
          shapes={currentShapes}
          bgColor={selectedBgColor}
        />
      </main>
    </div>
  );
};

export default App;
