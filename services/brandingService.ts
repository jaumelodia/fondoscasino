
import { TextConfig, LogoChoice, ShapeData } from "../types";

/**
 * Servicio de Branding Profesional V9.1
 * - Motor de renderizado con soporte de escala (Multi-Resolution Rendering).
 * - Sistema de word-wrap para Canvas que sincroniza la disposición con la previsualización.
 */

const LOGO_ICON_SVG_TEMPLATE = (fill: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 450" width="1000" height="450">
    <g id="logotipo-icono">
        <path fill="${fill}" d="M82.5 434.35c-31.76-5.1-58.28-24.14-72.26-51.87-1.67-3.31-4.32-10.06-5.88-15-2.7-8.5-2.86-9.95-2.85-26.98 0-19.41 1.16-25.92 6.95-39 11.02-24.93 40.37-48.66 65.65-53.08 9.54-1.67 32.91-1.96 40.39-.5 2.75.53 7.59 1.87 10.75 2.97l5.75 2 .17-31.69c.1-17.44.26-32.6.36-33.7s.25-26.98.33-57.51l.14-55.5 10.75-3.14c5.91-1.72 17.95-5.26 26.75-7.86 8.8-2.59 24.86-7.31 35.68-10.48l19.68-5.75 5.71 3.87c3.13 2.13 6.29 3.87 7.01 3.87s3.47-2.56 6.11-5.69c8-9.46 8.95-10.09 20.69-13.71 14.48-4.47 108.32-32.13 111.8-32.96 2.61-.63 2.7-.49 3.46 5.11.42 3.16.79 52.08.82 108.71l.04 102.97-13 4.09-13 4.1-11-5.21c-11.29-5.35-20.09-8.41-24.18-8.41H317v63c0 36.04.38 63 .89 63 .49 0 4.79-1.13 9.56-2.51 10.43-3.03 18.09-6.75 19.57-9.53 1.03-1.92 2.75-23 1.88-22.92-.22.02-4.23 1.31-8.9 2.88s-8.84 2.65-9.25 2.4c-.41-.24-.75-7.58-.75-16.31 0-14.25.18-15.93 1.75-16.4 10.65-3.18 47.14-13.61 47.62-13.61.35 0 .63 17.37.63 38.6 0 32.31-.25 39.12-1.51 41.77-2.84 6-25.82 19.41-40.52 23.66-9.13 2.63-29.23 3.71-39.47 2.12-11.46-1.79-25.77-7.1-34.96-12.99-9.82-6.28-22.84-18.92-29.55-28.68-21.8-31.68-20.36-77.55 3.39-108.3 13.81-17.89 32.38-29.92 54.62-35.4 11.92-2.94 30.05-2.92 42.74.06 5.08 1.19 10.33 2.16 11.66 2.16h2.41l.14-15.25c.08-8.39-.17-24.96-.55-36.83l-.69-21.58-13.1 3.88c-7.21 2.14-20.76 6.15-30.11 8.92-25.44 7.53-43.62 13.61-47.1 15.74-1.7 1.05-5.94 5.44-9.41 9.76s-6.88 8.48-7.57 9.24c-1.05 1.16-2.49.38-8.71-4.71l-7.46-6.1-13.59 3.88c-7.47 2.14-21.25 6.24-30.62 9.13L163 168.31v115.63l-5.25 1.49c-2.89.82-9.17 2.46-13.95 3.64l-8.7 2.15-10.3-5.1c-9.29-4.6-23.12-9.13-24.3-7.96-.25.26-.49 28.56-.52 62.9l-.07 62.44 2.8-.35c4.63-.57 14.28-4.18 23.52-8.79 4.8-2.4 9.31-4.36 10.01-4.36 1.25 0 20.6 7.45 26.01 10.02 1.51.71 2.75 1.73 2.75 2.26 0 3.04-20.93 18.82-31.72 23.91-11.97 5.65-21.64 7.89-35.78 8.3-6.6.19-13.35.13-15-.14"/>
    </g>
</svg>
`;

const logoCache: Record<string, HTMLCanvasElement> = {};

/**
 * Helper to wrap text into lines for Canvas rendering
 */
function getWrappedLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    // Respect explicit newlines first
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
            lines.push("");
            continue;
        }
        
        const words = paragraph.split(' ');
        let currentLine = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[n];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                lines.push(currentLine);
                currentLine = words[n];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
    }
    return lines;
}

export const getLogoCanvas = (color: 'white' | 'black', scale: number = 2): Promise<HTMLCanvasElement> => {
  const key = `${color}_${scale}`;
  if (logoCache[key]) return Promise.resolve(logoCache[key]);

  return new Promise(async (resolve, reject) => {
    try {
      const fill = color === 'white' ? '#FFFFFF' : '#000000';
      const svgString = LOGO_ICON_SVG_TEMPLATE(fill);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000 * scale; 
        canvas.height = 450 * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        const fontSize = 110 * scale;
        await document.fonts.load(`${fontSize}px Limelight`);
        
        ctx.font = `${fontSize}px Limelight`;
        ctx.fillStyle = fill;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic'; 

        ctx.fillText("Casino", 500 * scale, 120 * scale);
        ctx.fillText("Musical", 500 * scale, 260 * scale);
        ctx.fillText("Godella", 500 * scale, 400 * scale);

        logoCache[key] = canvas;
        resolve(canvas);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error procesando logo SVG"));
      };
      
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
};

export const preloadLogos = async () => {
  try {
    await Promise.all([getLogoCanvas('white', 2), getLogoCanvas('black', 2)]);
  } catch (e) {
    console.error("Error pre-cargando logos:", e);
  }
};

/**
 * Renderiza la escena completa con soporte para escalado de resolución (DPI).
 * @param width Ancho base en px.
 * @param height Alto base en px.
 * @param renderScale Multiplicador de resolución (p. ej. 2 para 2x píxeles).
 */
export const applyBranding = async (
  width: number,
  height: number,
  bgColor: string,
  shapes: ShapeData[],
  logoChoice: LogoChoice,
  percentX: number,
  percentY: number,
  percentScale: number,
  textConfig?: TextConfig,
  renderScale: number = 1
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = width * renderScale;
  canvas.height = height * renderScale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context error");

  // Configuración de renderizado ultra nítida
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Dibujar el fondo
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Redibujar todas las figuras con escalado proporcional
  shapes.forEach(shape => {
    const sX = shape.x * renderScale;
    const sY = shape.y * renderScale;
    const sW = shape.w * renderScale;
    const sH = shape.h * renderScale;

    ctx.save();
    ctx.translate(sX, sY);
    ctx.rotate(shape.rotation);
    ctx.fillStyle = shape.color;

    switch (shape.type) {
      case 'rect':
        const rh = shape.isSquare ? sW : sH;
        ctx.fillRect(-sW / 2, -rh / 2, sW, rh);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, sW / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        const triH = sH * (Math.sqrt(3)/2);
        ctx.moveTo(0, -triH/2);
        ctx.lineTo(sW/2, triH/2);
        ctx.lineTo(-sW/2, triH/2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'trapezoid':
        ctx.beginPath();
        const tW = (shape.topW || shape.w * 0.5) * renderScale;
        ctx.moveTo(-tW / 2, -sH / 2);
        ctx.lineTo(tW / 2, -sH / 2);
        ctx.lineTo(sW / 2, sH / 2);
        ctx.lineTo(-sW / 2, sH / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'rhombus':
        ctx.beginPath();
        ctx.moveTo(0, -sH / 2);
        ctx.lineTo(sW / 2, 0);
        ctx.lineTo(0, sH / 2);
        ctx.lineTo(-sW / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  });

  // 3. Logo (Escalado por renderScale)
  if (logoChoice !== 'none') {
    // Usamos escala 4x base + multiplicador de renderizado para máxima pureza
    const logoCanvas = await getLogoCanvas(logoChoice as 'white' | 'black', 4 * renderScale);
    const logoTargetWidth = (canvas.width * percentScale) / 100;
    const aspectRatio = logoCanvas.height / logoCanvas.width;
    const logoTargetHeight = logoTargetWidth * aspectRatio;
    const posX = (canvas.width * percentX) / 100;
    const posY = (canvas.height * percentY) / 100;

    ctx.drawImage(logoCanvas, posX, posY, logoTargetWidth, logoTargetHeight);
  }

  // 4. Capa de Texto (Escalado por renderScale con sistema de word-wrap)
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
    
    // Cálculo del ancho máximo para que no se salga de los bordes laterales
    // Sincronizado con BackgroundPreview: Math.min(x, 100 - x) * 2
    const maxWPercent = Math.min(textConfig.x, 100 - textConfig.x) * 2;
    const maxWidthPx = (canvas.width * maxWPercent) / 100;

    // Procesar texto para obtener líneas que ajusten al ancho
    const lines = getWrappedLines(ctx, textConfig.content, maxWidthPx);
    
    const lineHeight = fontSizePx * 1.1;
    const totalHeight = lines.length * lineHeight;
    const startY = ty - (totalHeight / 2) + (lineHeight / 2);

    lines.forEach((line, i) => {
      ctx.fillText(line, tx, startY + (i * lineHeight));
    });
    
    ctx.restore();
  }

  // Exportar como PNG (Sin pérdida de calidad)
  return canvas.toDataURL('image/png');
};
