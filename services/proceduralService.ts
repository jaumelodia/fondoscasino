
import { PALETTE } from "../constants.ts";

/**
 * Motor de Arte Generativo Bauhaus
 * Sustituye a la IA por algoritmos de dibujo vectorial procedural.
 */

export const drawBauhausPattern = (
  width: number,
  height: number,
  bgColor: string,
  dispersion: number,
  centerExclusion: number,
  shapeSize: number
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return "";

  // 1. Fondo sólido
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Parámetros de composición
  const numShapes = Math.floor(6 + (dispersion / 10)); 
  const paletteColors = Object.values(PALETTE).filter(c => c !== bgColor);
  const exclusionRadius = (width * 0.25) * (centerExclusion / 100);
  const centerX = width / 2;
  const centerY = height / 2;

  // 3. Dibujo de formas
  for (let i = 0; i < numShapes; i++) {
    ctx.save();
    
    // Posicionamiento con exclusión central
    let x, y;
    let attempts = 0;
    do {
      x = Math.random() * width;
      y = Math.random() * height;
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (dist > exclusionRadius || attempts > 20) break;
      attempts++;
    } while (true);

    // Tamaño proporcional
    const baseSize = width * 0.15 * (shapeSize / 50);
    const w = baseSize * (0.5 + Math.random());
    const h = baseSize * (0.5 + Math.random());

    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);
    ctx.fillStyle = paletteColors[Math.floor(Math.random() * paletteColors.length)];

    const shapeType = Math.floor(Math.random() * 4);
    switch (shapeType) {
      case 0: // Rectángulo
        ctx.fillRect(-w / 2, -h / 2, w, h);
        break;
      case 1: // Círculo
        ctx.beginPath();
        ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 2: // Triángulo
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 3: // Semicírculo
        ctx.beginPath();
        ctx.arc(0, 0, w / 2, 0, Math.PI);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
};
