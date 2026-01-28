
/**
 * Servicio de Branding Profesional V3.6
 * Sistema de alto rendimiento con pre-carga y caché de activos oficiales.
 * Utiliza versiones raw de GitHub para compatibilidad con Canvas.
 */

const LOGO_URLS = {
  white: 'https://raw.githubusercontent.com/jaumelodia/fondoscasino/faccc4f27e07ba7f272b6e37a3f9827f67adef27/logos/logo-blanco.png',
  black: 'https://raw.githubusercontent.com/jaumelodia/fondoscasino/faccc4f27e07ba7f272b6e37a3f9827f67adef27/logos/logo-negro.png'
};

// Caché interna para evitar descargar el logo más de una vez
const logoCache: { [key: string]: HTMLImageElement } = {};

/**
 * Carga una imagen asegurando compatibilidad CORS para uso en Canvas.
 */
const loadImg = (src: string): Promise<HTMLImageElement> => {
  if (logoCache[src]) return Promise.resolve(logoCache[src]);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Vital para evitar errores de seguridad al manipular el canvas
    img.onload = () => {
      logoCache[src] = img;
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Fallo al descargar el activo oficial: ${src}`));
    img.src = src;
  });
};

/**
 * Función opcional para pre-cargar los logos al inicio de la app.
 */
export const preloadLogos = async (): Promise<void> => {
  try {
    await Promise.all([
      loadImg(LOGO_URLS.white),
      loadImg(LOGO_URLS.black)
    ]);
    console.log("Logos oficiales pre-cargados con éxito.");
  } catch (err) {
    console.warn("Pre-carga fallida, se intentará cargar durante la generación.", err);
  }
};

export const applyBranding = async (
  backgroundImageUrl: string,
  logoChoice: 'white' | 'black' | 'auto'
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Error al crear el contexto del canvas");

  // 1. Cargar fondo (se asume dataURL o blob local)
  const bgImg = new Image();
  await new Promise((resolve) => {
    bgImg.onload = resolve;
    bgImg.src = backgroundImageUrl;
  });

  canvas.width = bgImg.width;
  canvas.height = bgImg.height;
  ctx.drawImage(bgImg, 0, 0);

  // 2. Parámetros de posicionamiento
  const padding = canvas.width * 0.05;
  const logoTargetWidth = canvas.width * 0.18;
  
  let finalLogoIsWhite = logoChoice === 'white';

  // 3. Lógica de Brillo Automático
  if (logoChoice === 'auto') {
    const analysisSize = Math.floor(logoTargetWidth);
    try {
      const imageData = ctx.getImageData(padding, padding, analysisSize, analysisSize).data;
      let brightnessSum = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i], g = imageData[i+1], b = imageData[i+2];
        brightnessSum += (0.2126 * r + 0.7152 * g + 0.0722 * b);
      }
      const avgBrightness = brightnessSum / (imageData.length / 4);
      finalLogoIsWhite = avgBrightness < 160; 
    } catch (e) {
      finalLogoIsWhite = true;
    }
  } else if (logoChoice === 'black') {
    finalLogoIsWhite = false;
  }

  // 4. Obtener el logo adecuado desde caché o descarga
  const logoUrl = finalLogoIsWhite ? LOGO_URLS.white : LOGO_URLS.black;
  
  try {
    const logoImg = await loadImg(logoUrl);
    const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
    const logoTargetHeight = logoTargetWidth * aspectRatio;
    
    ctx.drawImage(logoImg, padding, padding, logoTargetWidth, logoTargetHeight);
    return canvas.toDataURL('image/png', 1.0);
  } catch (err) {
    throw new Error(`Error de Branding: No se pudo cargar el logo oficial (${finalLogoIsWhite ? 'Blanco' : 'Negro'}). Verifique la conexión a GitHub.`);
  }
};
