
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
  aspectRatio,
  width,
  height
}) => {
  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `geogen-fondo-${Date.now()}.png`;
    link.click();
  };

  if (!imageUrl && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200 w-full max-w-4xl">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-image text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Listo para crear?</h3>
        <p className="text-gray-500 max-w-sm">
          Selecciona el formato deseado y haz clic en "Generar" para crear un fondo geométrico único con definición ultra-nítida.
        </p>
      </div>
    );
  }

  const dynamicAspectRatio = width / height;

  return (
    <div className="relative group w-full flex flex-col justify-center items-center h-full max-h-full py-4">
      <div 
        className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 bg-white border border-gray-100"
        style={{ 
          aspectRatio: `${width} / ${height}`,
          maxHeight: '100%',
          maxWidth: '100%',
          width: dynamicAspectRatio > 1.2 ? '100%' : 'auto',
          height: dynamicAspectRatio < 0.8 ? '100%' : 'auto'
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-10 p-6 text-center">
            <div className="relative w-16 h-16 mb-4">
               <div className="absolute inset-0 border-4 border-[#8A1B61]/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-[#8A1B61] rounded-full animate-spin"></div>
            </div>
            <p className="text-[#8A1B61] font-bold text-lg">Enfocando diseño...</p>
            <p className="text-[#8A1B61]/60 text-xs mt-2 font-medium">Calculando bordes de precisión</p>
          </div>
        ) : null}

        {imageUrl && (
          <>
            <img 
              src={imageUrl} 
              alt="Fondo generado" 
              className={`w-full h-full object-contain transition-opacity duration-700 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
              style={{ 
                imageRendering: 'crisp-edges',
                msInterpolationMode: 'nearest-neighbor'
              }}
            />
            {!isLoading && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={downloadImage}
                  className="bg-white/90 backdrop-blur text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
                  title="Descargar imagen"
                >
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {imageUrl && !isLoading && (
        <div className="mt-8 flex flex-col items-center text-center px-4 max-w-2xl">
           <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
             Calidad optimizada para web y carga rápida. Si necesitas mayor resolución para impresión profesional o gran formato, 
             te recomendamos la herramienta libre y gratuita <a href="https://www.upscayl.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#8A1B61] hover:underline decoration-2 underline-offset-4 transition-all">Upscayl</a> para aumentar el detalle sin pérdida.
           </p>
        </div>
      )}
    </div>
  );
};

export default BackgroundPreview;
