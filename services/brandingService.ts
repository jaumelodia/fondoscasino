
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
    if (!ctx) return reject();

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      ctx.drawImage(bgImg, 0, 0);

      // --- DETECCIÓN DE BRILLO PARA LOGO AUTO ---
      const padding = canvas.width * 0.05;
      const logoTargetWidth = canvas.width * 0.15;
      
      let finalLogoType = logoChoice;
      if (logoChoice === 'auto') {
        // Analizar una pequeña muestra de píxeles en el área del logo
        const imageData = ctx.getImageData(padding, padding, 50, 50).data;
        let brightnessSum = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          // Fórmula de luminancia: 0.299R + 0.587G + 0.114B
          brightnessSum += (0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2]);
        }
        const avgBrightness = brightnessSum / (imageData.length / 4);
        finalLogoType = avgBrightness > 128 ? 'black' : 'white';
      }

      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.onload = () => {
        const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
        const logoTargetHeight = logoTargetWidth * aspectRatio;
        
        ctx.drawImage(logoImg, padding, padding, logoTargetWidth, logoTargetHeight);
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      logoImg.onerror = () => resolve(backgroundImageUrl);
      logoImg.src = finalLogoType === 'white' ? './logo-blanco.png' : './logo-negro.png';
    };
    bgImg.src = backgroundImageUrl;
  });
};
