
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | 'A4';

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
