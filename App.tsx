
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import BackgroundPreview from './components/BackgroundPreview.tsx';
import { AspectRatio, GeneratedImage } from './types.ts';
import { generateGeometricImage } from './services/geminiService.ts';
import { PALETTE } from './constants.ts';

const App: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [widthPx, setWidthPx] = useState<number>(1920);
  const [heightPx, setHeightPx] = useState<number>(1080);
  const [dispersion, setDispersion] = useState<number>(50);
  const [centerExclusion, setCenterExclusion] = useState<number>(0);
  const [selectedBgColor, setSelectedBgColor] = useState<string>(PALETTE.crema);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<{message: string, isQuota: boolean} | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        }
      } catch (e) {
        console.warn("AI Studio key selector not available", e);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setHasKey(true);
        setError(null);
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateGeometricImage(aspectRatio, selectedBgColor, dispersion, centerExclusion);
      setCurrentImage(url);
      
      const newImg: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: url,
        timestamp: Date.now(),
        aspectRatio: aspectRatio,
        dimensions: { width: widthPx, height: heightPx }
      };
      
      setHistory(prev => [newImg, ...prev].slice(0, 10));
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Error desconocido";
      const isQuota = errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");
      
      setError({
        message: isQuota 
          ? "Se ha agotado la cuota gratuita de la API. Para continuar generando imágenes, por favor selecciona tu propia clave de API de un proyecto con facturación habilitada." 
          : "Algo salió mal al generar la imagen. Por favor, comprueba tu conexión y configuración.",
        isQuota
      });
    } finally {
      setIsLoading(false);
    }
  }, [aspectRatio, selectedBgColor, widthPx, heightPx, dispersion, centerExclusion]);

  const selectFromHistory = (img: GeneratedImage) => {
    setCurrentImage(img.url);
    setAspectRatio(img.aspectRatio);
    if (img.dimensions) {
      setWidthPx(img.dimensions.width);
      setHeightPx(img.dimensions.height);
    }
  };

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
        dispersion={dispersion}
        setDispersion={setDispersion}
        centerExclusion={centerExclusion}
        setCenterExclusion={setCenterExclusion}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        onOpenKeySelector={handleOpenKeySelector}
        hasCustomKey={hasKey}
      />

      <main className="flex-1 p-4 lg:p-8 flex flex-col min-h-0 bg-gray-50/30 relative">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
          
          {error && (
            <div className={`mb-6 p-4 rounded-2xl border flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${
              error.isQuota ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <div className="flex items-start gap-3">
                <i className={`fa-solid ${error.isQuota ? 'fa-key' : 'fa-triangle-exclamation'} mt-1 text-lg`}></i>
                <div>
                  <p className="font-bold text-sm">
                    {error.isQuota ? "Cuota de API Agotada" : "Error de Generación"}
                  </p>
                  <p className="text-sm opacity-90 leading-relaxed mt-1">
                    {error.message}
                  </p>
                </div>
              </div>
              {error.isQuota && (
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={handleOpenKeySelector}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-plus-circle"></i>
                    Configurar mi propia clave API
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-900 text-xs font-semibold underline underline-offset-4"
                  >
                    Ver documentación de facturación
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
            <BackgroundPreview 
              imageUrl={currentImage} 
              isLoading={isLoading}
              aspectRatio={aspectRatio}
              width={widthPx}
              height={heightPx}
            />
          </div>

          {history.length > 0 && (
            <div className="mt-8 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                  Variaciones Recientes
                </h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
                {history.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => selectFromHistory(img)}
                    className={`relative shrink-0 rounded-xl overflow-hidden h-20 w-20 border-2 transition-all hover:scale-105 group shadow-sm ${
                      currentImage === img.url ? 'border-[#8A1B61] ring-2 ring-[#8A1B61]/20' : 'border-white hover:border-gray-300'
                    }`}
                  >
                    <img src={img.url} alt="Historial" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#8A1B61]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <i className="fa-solid fa-eye text-white text-xs"></i>
                    </div>
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