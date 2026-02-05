
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, LogoChoice, TextConfig, ShapeData } from './types.ts';
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
  const [currentShapes, setCurrentShapes] = useState<ShapeData[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  const [history, setHistory] = useState<{url: string, shapes: ShapeData[]}[]>([]);

  useEffect(() => { preloadLogos(); }, []);

  const handleResetLogo = useCallback(() => {
    setLogoX(4); setLogoY(4);
    const scale20Formats: AspectRatio[] = ['A4', '9:16', '3:4', '1:1'];
    setLogoScale(scale20Formats.includes(aspectRatio) ? 20 : 12);
  }, [aspectRatio]);

  const performGeneration = useCallback((saveToHistory: boolean) => {
    setIsLoading(true);
    setBrandingError(null);
    requestAnimationFrame(() => {
      try {
        const { url, shapes } = drawBauhausPattern(widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize);
        setBasePatternUrl(url);
        setCurrentShapes(shapes);
        
        if (saveToHistory) {
          setHistory(prev => {
            const newHistory = [{url, shapes}, ...prev].slice(0, 8);
            return newHistory;
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });
  }, [widthPx, heightPx, selectedBgColor, density, dispersion, centerExclusion, shapeSize]);

  useEffect(() => {
    performGeneration(false);
  }, [selectedBgColor, density, dispersion, centerExclusion, shapeSize, widthPx, heightPx, performGeneration]);

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
          { ...textConfig, enabled: false }
        );
        setCurrentImage(finalUrl);
      } catch (err: any) {
        setBrandingError(err.message);
        if (basePatternUrl) setCurrentImage(basePatternUrl);
      }
    };
    updateLogoOverlay();
  }, [currentShapes, logoChoice, logoX, logoY, logoScale, textConfig.enabled, selectedBgColor, widthPx, heightPx]);

  const handleRestoreFromHistory = (item: {url: string, shapes: ShapeData[]}) => {
    setBasePatternUrl(item.url);
    setCurrentShapes(item.shapes);
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
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
        onResetLogo={handleResetLogo} 
        onGenerate={() => performGeneration(true)} 
        isLoading={isLoading} textConfig={textConfig} setTextConfig={setTextConfig}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-100/60">
        <div className="w-full bg-[#8E2464] py-2.5 px-6 flex justify-between items-center shadow-lg z-20 shrink-0">
          <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Procedural Engine v8.0 • Direct Vector Rendering</p>
          <div className="flex gap-4">
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{widthPx} x {heightPx} px</span>
          </div>
        </div>

        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
          <div className="w-full h-[75vh] flex items-center justify-center p-6 lg:p-12 shrink-0">
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
          </div>

          <div className={`w-full max-w-6xl px-8 pb-12 transition-all duration-700 ease-out ${history.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-[10px] text-[#8E2464]"></i>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Variaciones Guardadas</span>
              </div>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 py-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRestoreFromHistory(item)}
                  className={`group relative w-24 h-24 rounded-2xl border-2 transition-all overflow-hidden bg-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${basePatternUrl === item.url ? 'border-[#8E2464] ring-4 ring-[#8E2464]/10 scale-110 z-10' : 'border-white hover:border-gray-200'}`}
                >
                  <img src={item.url} className="w-full h-full object-cover" alt={`Historial ${idx}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#8E2464]/20 to-transparent transition-opacity ${basePatternUrl === item.url ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                  {basePatternUrl === item.url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-[#8E2464] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white animate-bounce-short">
                        <i className="fa-solid fa-check text-[10px]"></i>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
        main ::-webkit-scrollbar {
          width: 6px;
        }
        main ::-webkit-scrollbar-track {
          background: transparent;
        }
        main ::-webkit-scrollbar-thumb {
          background: rgba(142, 36, 100, 0.1);
          border-radius: 10px;
        }
        main ::-webkit-scrollbar-thumb:hover {
          background: rgba(142, 36, 100, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
