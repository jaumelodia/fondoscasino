
/**
 * Servicio de Branding Profesional V5.4
 * Incluye auto-recorte de transparencia y lógica de inversión dinámica para el logo negro.
 */

const LOGO_URLS = {
  // Usamos el mismo recurso para ambos, ya que el negro se generará por inversión
  white: 'https://raw.githubusercontent.com/jaumelodia/fondoscasino/refs/heads/main/logos/IMG_0657.png',
  black: 'https://raw.githubusercontent.com/jaumelodia/fondoscasino/refs/heads/main/logos/IMG_0657.png'
};

// Caché para los logos ya procesados (recortados)
const logoCache: { [key: string]: HTMLCanvasElement } = {};

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
      if (alpha > 0) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < left || bottom < top) return tempCanvas;

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

const loadAndProcessLogo = (src: string): Promise<HTMLCanvasElement> => {
  if (logoCache[src]) return Promise.resolve(logoCache[src]);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.onload = () => {
      const processed = trimImage(img);
      logoCache[src] = processed;
      resolve(processed);
    };
    img.onerror = () => reject(new Error(`Error: No se pudo cargar el logo de marca.`));
    img.src = src;
  });
};

export const preloadLogos = async (): Promise<void> => {
  try {
    // Al ser la misma URL, se cargará y cacheará una sola vez
    await loadAndProcessLogo(LOGO_URLS.white);
  } catch (err) {
    console.warn("Branding: Error en pre-carga de logos.", err);
  }
};

/**
 * Aplica el logo sobre la imagen. Si es negro, aplica un filtro de inversión.
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

  // Usamos siempre el recurso base (que es blanco)
  const logoUrl = LOGO_URLS.white;
  
  try {
    const logoCanvas = await loadAndProcessLogo(logoUrl);
    
    const logoTargetWidth = (canvas.width * percentScale) / 100;
    const aspectRatio = logoCanvas.height / logoCanvas.width;
    const logoTargetHeight = logoTargetWidth * aspectRatio;

    const posX = (canvas.width * percentX) / 100;
    const posY = (canvas.height * percentY) / 100;
    
    ctx.save(); // Guardamos estado para no afectar al resto del canvas
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Si el usuario eligió negro, invertimos el logo blanco
    if (logoChoice === 'black') {
      ctx.filter = 'invert(100%)';
    }
    
    ctx.drawImage(logoCanvas, posX, posY, logoTargetWidth, logoTargetHeight);
    
    ctx.restore(); // Restauramos (equivale a ctx.filter = 'none')
    
    return canvas.toDataURL('image/png', 1.0);
  } catch (err) {
    throw new Error(`Branding: Error al estampar el logo.`);
  }
};
