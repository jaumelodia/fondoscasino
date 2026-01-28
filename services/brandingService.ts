
/**
 * Servicio de Branding Inteligente con Detección de Brillo
 */

export const applyBranding = async (
  backgroundImageUrl: string,
  logoChoice: 'white' | 'black' | 'auto'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error("Canvas context failed"));

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      ctx.drawImage(bgImg, 0, 0);

      // --- CÁLCULO DE ÁREA DE MARCA ---
      const padding = canvas.width * 0.05;
      const logoTargetWidth = canvas.width * 0.15;
      
      let finalLogoType = logoChoice;

      // Si es AUTO, analizamos la esquina superior izquierda
      if (logoChoice === 'auto') {
        try {
          // Analizar área donde irá el logo (aprox 15% del ancho)
          const analysisSize = Math.floor(logoTargetWidth);
          const imageData = ctx.getImageData(padding, padding, analysisSize, analysisSize).data;
          let brightnessSum = 0;
          for (let i = 0; i < imageData.length; i += 4) {
            // Luminancia ITU-R BT.709
            const r = imageData[i];
            const g = imageData[i+1];
            const b = imageData[i+2];
            brightnessSum += (0.2126 * r + 0.7152 * g + 0.0722 * b);
          }
          const avgBrightness = brightnessSum / (imageData.length / 4);
          finalLogoType = avgBrightness > 140 ? 'black' : 'white';
        } catch (e) {
          console.error("Brightness detection error:", e);
          finalLogoType = 'white'; // Fallback
        }
      }

      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      
      // Eventos antes del src
      logoImg.onload = () => {
        const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
        const logoTargetHeight = logoTargetWidth * aspectRatio;
        
        ctx.globalAlpha = 1.0;
        ctx.drawImage(logoImg, padding, padding, logoTargetWidth, logoTargetHeight);
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      logoImg.onerror = () => {
        console.warn("Logo not found, returning base image");
        resolve(backgroundImageUrl);
      };

      logoImg.src = finalLogoType === 'white' ? './logo-blanco.png' : './logo-negro.png';
    };
    
    bgImg.onerror = () => reject(new Error("BG Load error"));
    bgImg.src = backgroundImageUrl;
  });
};
