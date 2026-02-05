
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | 'A4' | 'custom';
export type LogoChoice = 'none' | 'white' | 'black';

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

export interface GeneratorConfig {
  aspectRatio: AspectRatio;
  intensity: 'minimal' | 'balanced' | 'complex';
}

export interface LogoConfig {
  x: number;
  y: number;
  scale: number;
}
