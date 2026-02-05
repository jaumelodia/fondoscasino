
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | 'A4' | 'custom';
export type LogoChoice = 'none' | 'white' | 'black';

export interface ShapeData {
  type: 'rect' | 'circle' | 'triangle' | 'trapezoid' | 'rhombus';
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  color: string;
  isSquare?: boolean;
  topW?: number;
}

export interface TextConfig {
  enabled: boolean;
  content: string;
  x: number; // Porcentaje 0-100
  y: number; // Porcentaje 0-100
  fontSize: number; // Porcentaje relativo al ancho de la imagen
  color: 'black' | 'white';
}

export interface CustomDimensions {
  width: number;
  height: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  dimensions?: CustomDimensions;
}
