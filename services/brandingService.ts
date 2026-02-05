
/**
 * Servicio de Branding Profesional V5.6
 * - Recurso base: Logo NEGRO.
 * - Logo BLANCO generado mediante inversión de colores (invert 100%).
 */

// URL del logo NEGRO (fuente original)
const LOGO_URL = 'https://raw.githubusercontent.com/jaumelodia/fondoscasino/main/logos/logo-casino-musical.png';

// Caché para el logo procesado (recortado)
let processedLogoCache: HTMLCanvasElement | null = null;

/**
 * Escanea la imagen y devuelve un canvas recortado eliminando la transparencia sobrante.
 */
const trimImage = (img: HTMLImageElement): HTMLCanvasElement => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  if (!tempCtx) return tempCanvas;

  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  tempCtx.drawImage(img, 0, 0);

  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  
  let top = imageData.height, left = imageData.width, right = 0, bottom = 0;

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const alpha = data[(y * imageData.width + x) * 4 + 3];
      if (alpha > 15) { // Umbral de opacidad para un recorte más limpio
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < left || bottom < top) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = img.width;
    fallbackCanvas.height = img.height;
    fallbackCanvas.getContext('2d')?.drawImage(img, 0, 0);
    return fallbackCanvas;
  }

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;
  
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  const trimmedCtx = trimmedCanvas.getContext('2d');
  
  if (trimmedCtx) {
    trimmedCtx.drawImage(img, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
  }
  
  return trimmedCanvas;
};

/**
 * Carga el logo base (negro) y lo procesa.
 */
const loadAndProcessLogo = (): Promise<HTMLCanvasElement> => {
  if (processedLogoCache) return Promise.resolve(processedLogoCache);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    
    img.onload = () => {
      try {
        const processed = trimImage(img);
        processedLogoCache = processed;
        resolve(processed);
      } catch (e) {
        reject(new Error("Error al procesar los píxeles del logo."));
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Error de red: No se pudo cargar el logo desde la URL de GitHub.`));
    };
    
    img.src = LOGO_URL;
  });
};

export const preloadLogos = async (): Promise<void> => {
  try {
    await loadAndProcessLogo();
    console.log("Branding: Logo negro cargado correctamente.");
  } catch (err) {
    console.warn("Branding: Error en pre-carga de logos.", err);
  }
};

/**
 * Aplica el logo sobre la imagen. 
 * El logo original es NEGRO; si se pide 'white', se invierte vía canvas filter.
 */
export const applyBranding = async (
  backgroundImageUrl: string,
  logoChoice: 'white' | 'black',
  percentX: number,
  percentY: number,
  percentScale: number
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Error al inicializar motor gráfico.");

  const bgImg = new Image();
  await new Promise((resolve, reject) => {
    bgImg.onload = resolve;
    bgImg.onerror = () => reject(new Error("Error al procesar fondo base."));
    bgImg.src = backgroundImageUrl;
  });

  canvas.width = bgImg.width;
  canvas.height = bgImg.height;
  ctx.drawImage(bgImg, 0, 0);

  try {
    // Obtener el logo procesado (negro en origen)
    const logoCanvas = await loadAndProcessLogo();
    
    const logoTargetWidth = (canvas.width * percentScale) / 100;
    const aspectRatio = logoCanvas.height / logoCanvas.width;
    const logoTargetHeight = logoTargetWidth * aspectRatio;

    const posX = (canvas.width * percentX) / 100;
    const posY = (canvas.height * percentY) / 100;
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // LÓGICA DE INVERSIÓN:
    // El logo original es NEGRO. 
    // Si elegimos 'white', aplicamos inversión total (Negro -> Blanco).
    if (logoChoice === 'white') {
      ctx.filter = 'invert(100%)';
    } else {
      ctx.filter = 'none';
    }
    
    ctx.drawImage(logoCanvas, posX, posY, logoTargetWidth, logoTargetHeight);
    ctx.restore();
    
    return canvas.toDataURL('image/png', 1.0);
  } catch (err: any) {
    throw new Error(err.message || "Error al estampar marca de agua.");
  }
};
