
import { PALETTE } from "../constants.ts";

/**
 * Motor de Arte Generativo Bauhaus Procedural V3.3
 * - Exclusión elíptica proporcional para el Vacío Central.
 * - Algoritmo de candidatos para dispersión inteligente.
 * - Formas geométricas puras (sin semicírculos).
 */

interface Point {
  x: number;
  y: number;
}

export const drawBauhausPattern = (
  width: number,
  height: number,
  bgColor: string,
  density: number,
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

  // 2. Parámetros base
  const numShapes = Math.floor(2 + (density / 100) * 18); 
  const paletteColors = Object.values(PALETTE).filter(c => c !== bgColor);
  const minSide = Math.min(width, height);
  
  // Parámetros de la Elipse de Exclusión
  const centerX = width / 2;
  const centerY = height / 2;
  // El radio de la elipse escala con el porcentaje del slider (0 a 1.0)
  const exclusionA = (width / 2) * (centerExclusion / 100);
  const exclusionB = (height / 2) * (centerExclusion / 100);

  const placedShapes: Point[] = [];

  // 3. Dibujo de formas con algoritmo de dispersión y exclusión elíptica
  for (let i = 0; i < numShapes; i++) {
    let bestX = Math.random() * width;
    let bestY = Math.random() * height;
    
    // Dispersión: evaluamos múltiples candidatos para encontrar el lugar con más espacio
    const numCandidates = 1 + Math.floor((dispersion / 100) * 60);
    let maxMinDist = -1;
    let foundValidCandidate = false;

    for (let c = 0; c < numCandidates; c++) {
      const tx = Math.random() * width;
      const ty = Math.random() * height;

      // VALIDACIÓN: ELIPSE DE VACÍO CENTRAL
      // Ecuación: (x-h)^2/a^2 + (y-k)^2/b^2 < 1
      if (centerExclusion > 0) {
        const dx = tx - centerX;
        const dy = ty - centerY;
        const insideEllipse = (dx * dx) / (exclusionA * exclusionA) + (dy * dy) / (exclusionB * exclusionB) < 1;
        if (insideEllipse) continue;
      }

      foundValidCandidate = true;

      // Si es la primera forma válida, la aceptamos
      if (placedShapes.length === 0) {
        bestX = tx;
        bestY = ty;
        break;
      }

      // Cálculo de distancia a la forma más cercana para dispersión
      let minDistToOthers = Infinity;
      for (const other of placedShapes) {
        const d = Math.sqrt((tx - other.x) ** 2 + (ty - other.y) ** 2);
        if (d < minDistToOthers) minDistToOthers = d;
      }

      if (minDistToOthers > maxMinDist) {
        maxMinDist = minDistToOthers;
        bestX = tx;
        bestY = ty;
      }
    }

    // Si no encontramos candidato (p.ej. exclusión 100%), saltamos
    if (!foundValidCandidate && placedShapes.length > 0) continue;

    placedShapes.push({ x: bestX, y: bestY });

    // 4. Dibujar la forma elegida
    ctx.save();
    
    // Tamaño basado en minSide para que no varíe drásticamente entre formatos
    const baseUnit = minSide * 0.25;
    const sScale = (shapeSize / 50) * (0.6 + Math.random() * 0.9);
    const w = baseUnit * sScale;
    const h = baseUnit * sScale;

    ctx.translate(bestX, bestY);
    ctx.rotate(Math.random() * Math.PI * 2);
    
    ctx.fillStyle = paletteColors[Math.floor(Math.random() * paletteColors.length)];
    ctx.globalAlpha = 1.0;

    const shapeType = Math.floor(Math.random() * 5);
    switch (shapeType) {
      case 0: // Rectángulo / Cuadrado
        const isSquare = Math.random() > 0.5;
        ctx.fillRect(-w / 2, isSquare ? -w / 2 : -h / 2, w, isSquare ? w : h);
        break;
      case 1: // Círculo Completo
        ctx.beginPath();
        ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 2: // Triángulo
        ctx.beginPath();
        const triH = h * (Math.sqrt(3)/2);
        ctx.moveTo(0, -triH/2);
        ctx.lineTo(w/2, triH/2);
        ctx.lineTo(-w/2, triH/2);
        ctx.closePath();
        ctx.fill();
        break;
      case 3: // Trapecio
        ctx.beginPath();
        const topW = w * (0.4 + Math.random() * 0.4);
        ctx.moveTo(-topW / 2, -h / 2);
        ctx.lineTo(topW / 2, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 4: // Rombo
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(0, h / 2);
        ctx.lineTo(-w / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
};
