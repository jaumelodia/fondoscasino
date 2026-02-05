
import { PALETTE } from "../constants.ts";
import { ShapeData } from "../types.ts";

/**
 * Motor de Arte Generativo Bauhaus Procedural V3.4
 * - Ahora devuelve los metadatos de las formas para exportación vectorial.
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
): { url: string; shapes: ShapeData[] } => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return { url: "", shapes: [] };

  // 1. Fondo sólido
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Parámetros base
  const numShapes = Math.floor(2 + (density / 100) * 18); 
  const paletteColors = Object.values(PALETTE).filter(c => c !== bgColor);
  const minSide = Math.min(width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const exclusionA = (width / 2) * (centerExclusion / 100);
  const exclusionB = (height / 2) * (centerExclusion / 100);

  const placedShapes: Point[] = [];
  const shapesData: ShapeData[] = [];

  // 3. Generación de formas
  for (let i = 0; i < numShapes; i++) {
    let bestX = Math.random() * width;
    let bestY = Math.random() * height;
    
    const numCandidates = 1 + Math.floor((dispersion / 100) * 60);
    let maxMinDist = -1;
    let foundValidCandidate = false;

    for (let c = 0; c < numCandidates; c++) {
      const tx = Math.random() * width;
      const ty = Math.random() * height;

      if (centerExclusion > 0) {
        const dx = tx - centerX;
        const dy = ty - centerY;
        const insideEllipse = (dx * dx) / (exclusionA * exclusionA) + (dy * dy) / (exclusionB * exclusionB) < 1;
        if (insideEllipse) continue;
      }

      foundValidCandidate = true;

      if (placedShapes.length === 0) {
        bestX = tx;
        bestY = ty;
        break;
      }

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

    if (!foundValidCandidate && placedShapes.length > 0) continue;

    placedShapes.push({ x: bestX, y: bestY });

    const baseUnit = minSide * 0.25;
    const sScale = (shapeSize / 50) * (0.6 + Math.random() * 0.9);
    const w = baseUnit * sScale;
    const h = baseUnit * sScale;
    const rotation = Math.random() * Math.PI * 2;
    const color = paletteColors[Math.floor(Math.random() * paletteColors.length)];
    const shapeTypeIdx = Math.floor(Math.random() * 5);
    
    const types: ShapeData['type'][] = ['rect', 'circle', 'triangle', 'trapezoid', 'rhombus'];
    const type = types[shapeTypeIdx];
    
    const shape: ShapeData = {
      type,
      x: bestX,
      y: bestY,
      w,
      h,
      rotation,
      color,
      isSquare: type === 'rect' ? Math.random() > 0.5 : undefined,
      topW: type === 'trapezoid' ? w * (0.4 + Math.random() * 0.4) : undefined
    };

    shapesData.push(shape);

    // 4. Dibujar en Canvas (Vista Previa)
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    ctx.fillStyle = shape.color;

    switch (shape.type) {
      case 'rect':
        ctx.fillRect(-shape.w / 2, shape.isSquare ? -shape.w / 2 : -shape.h / 2, shape.w, shape.isSquare ? shape.w : shape.h);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, shape.w / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        const triH = shape.h * (Math.sqrt(3)/2);
        ctx.moveTo(0, -triH/2);
        ctx.lineTo(shape.w/2, triH/2);
        ctx.lineTo(-shape.w/2, triH/2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'trapezoid':
        ctx.beginPath();
        const tW = shape.topW || shape.w * 0.5;
        ctx.moveTo(-tW / 2, -shape.h / 2);
        ctx.lineTo(tW / 2, -shape.h / 2);
        ctx.lineTo(shape.w / 2, shape.h / 2);
        ctx.lineTo(-shape.w / 2, shape.h / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'rhombus':
        ctx.beginPath();
        ctx.moveTo(0, -shape.h / 2);
        ctx.lineTo(shape.w / 2, 0);
        ctx.lineTo(0, shape.h / 2);
        ctx.lineTo(-shape.w / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  return { url: canvas.toDataURL('image/png'), shapes: shapesData };
};
