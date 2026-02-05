
import { TextConfig, LogoChoice } from "../types";

/**
 * Servicio de Branding Profesional V6.2
 * - Soporte multilínea para texto.
 * - Anclaje central para alineación perfecta.
 */

const LOGO_URL = 'https://i.ibb.co/21PwstZG/logo-casino-musical.png';
let processedLogoCache: HTMLCanvasElement | null = null;

const loadAndProcessLogo = (): Promise<HTMLCanvasElement> => {
  if (processedLogoCache) return Promise.resolve(processedLogoCache);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      processedLogoCache = canvas;
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Error de red cargando logo."));
    img.src = LOGO_URL + `?t=${Date.now()}`;
  });
};

export const preloadLogos = async () => { try { await loadAndProcessLogo(); } catch(e){} };

export const applyBranding = async (
  backgroundImageUrl: string,
  logoChoice: LogoChoice,
  percentX: number,
  percentY: number,
  percentScale: number,
  textConfig?: TextConfig
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context error");

  const bgImg = new Image();
  await new Promise((resolve) => { bgImg.onload = resolve; bgImg.src = backgroundImageUrl; });

  canvas.width = bgImg.width;
  canvas.height = bgImg.height;
  ctx.drawImage(bgImg, 0, 0);

  // 1. Dibujar Logo
  if (logoChoice !== 'none') {
    const logoCanvas = await loadAndProcessLogo();
    const logoTargetWidth = (canvas.width * percentScale) / 100;
    const aspectRatio = logoCanvas.height / logoCanvas.width;
    const logoTargetHeight = logoTargetWidth * aspectRatio;
    const posX = (canvas.width * percentX) / 100;
    const posY = (canvas.height * percentY) / 100;

    ctx.save();
    if (logoChoice === 'white') ctx.filter = 'invert(100%)';
    ctx.drawImage(logoCanvas, posX, posY, logoTargetWidth, logoTargetHeight);
    ctx.restore();
  }

  // 2. Dibujar Texto Multilínea
  if (textConfig && textConfig.enabled && textConfig.content.trim()) {
    const fontSizePx = (canvas.width * textConfig.fontSize) / 100;
    await document.fonts.load(`${fontSizePx}px Limelight`);
    
    ctx.save();
    ctx.font = `${fontSizePx}px Limelight`;
    ctx.fillStyle = textConfig.color === 'white' ? '#FFFFFF' : '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const tx = (canvas.width * textConfig.x) / 100;
    const ty = (canvas.height * textConfig.y) / 100;
    
    // Split por saltos de línea manuales
    const lines = textConfig.content.split('\n');
    const lineHeight = fontSizePx * 1.1;
    
    // Calcular el desplazamiento inicial para que el bloque de texto esté centrado verticalmente respecto a ty
    const totalHeight = lines.length * lineHeight;
    const startY = ty - (totalHeight / 2) + (lineHeight / 2);

    lines.forEach((line, i) => {
      ctx.fillText(line, tx, startY + (i * lineHeight));
    });
    
    ctx.restore();
  }

  return canvas.toDataURL('image/png', 1.0);
};
