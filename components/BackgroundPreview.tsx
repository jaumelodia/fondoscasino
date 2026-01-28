
import React from 'react';
import { AspectRatio } from '../types';

interface BackgroundPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({ 
  imageUrl, 
  isLoading,
  width,
  height
}) => {
  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `casino-musical-fondo-${Date.now()}.png`;
    link.click();
  };

  if (!imageUrl && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <i className="fa-solid fa-shapes text-3xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Motor Procedural Bauhaus</h3>
        <p className="text-gray-500 max-w-sm">
          Ajusta los parámetros y genera fondos geométricos instantáneos en alta resolución.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 lg:p-6 overflow-hidden">
      {/* Contenedor con límites estrictos de pantalla */}
      <div className="relative w-full h-full flex items-center justify-center max-h-[calc(100vh-180px)] lg:max-h-full">
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-20 p-6 text-center rounded-xl border border-gray-100 shadow-sm">
            <div className="relative w-12 h-12 mb-4">
               <div className="absolute inset-0 border-4 border-[#8E2464]/10 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-[#8E2464] rounded-full animate-spin"></div>
            </div>
            <p className="text-[#8E2464] font-bold text-xs tracking-widest uppercase">Dibujando Arte Bauhaus...</p>
          </div>
        )}

        {imageUrl && (
          <div className="relative h-full w-full flex items-center justify-center">
            {/* 
               La clave aquí es object-contain y max-h-full. 
               Esto obliga a la imagen a encogerse si el formato es A4 
               pero la pantalla es horizontal.
            */}
            <img 
              src={imageUrl} 
              alt="Fondo generado" 
              className={`max-w-full max-h-full w-auto h-auto object-contain shadow-2xl rounded-sm border border-gray-200 transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
              style={{ filter: isLoading ? 'blur(4px)' : 'none' }}
            />
            
            {!isLoading && (
              <div className="absolute top-4 right-4 z-30">
                <button 
                  onClick={downloadImage}
                  className="bg-white/95 backdrop-blur text-gray-800 w-12 h-12 rounded-full shadow-xl hover:bg-[#8E2464] hover:text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                  title="Descargar diseño final"
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
