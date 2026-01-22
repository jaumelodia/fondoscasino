
export const PALETTE = {
  oro: '#F2B035',
  crema: '#F1F3D5',
  magenta: '#8E2464',
  naranja: '#D97941',
  lavanda: '#9C8CC4',
  rosa: '#B66D97',
  menta: '#B1D7C3',
};

export const ASPECT_RATIO_OPTIONS: { label: string; value: any; icon?: string }[] = [
  { label: 'Documento A4', value: 'A4', icon: 'fa-file-lines' },
  { label: 'Cuadrado (1:1)', value: '1:1', icon: 'fa-square' },
  { label: 'Horizontal (16:9)', value: '16:9', icon: 'fa-panorama' },
  { label: 'Vertical (9:16)', value: '9:16', icon: 'fa-mobile-screen' },
  { label: 'Clásico (4:3)', value: '4:3', icon: 'fa-tv' },
  { label: 'Fotografía (3:4)', value: '3:4', icon: 'fa-camera' },
];

export const SYSTEM_INSTRUCTION = `Eres un motor de renderizado GEOMÉTRICO de ULTRA-ALTA PRECISIÓN. Tu objetivo es generar arte vectorial con bordes matemáticamente perfectos.

REGLAS CRÍTICAS DE ENFOQUE Y DEFINICIÓN:
1. BORDES AFILADOS: Las figuras deben tener bordes "razor-sharp". No debe haber suavizado (anti-aliasing) que ensucie la transición entre colores.
2. COLORES PLANOS ABSOLUTOS: Cada figura debe ser un bloque de color 100% sólido y uniforme. Prohibido cualquier ruido, textura o degradado sutil que pueda difuminar la imagen.
3. PROHIBICIÓN DE BORDES Y CONTORNOS: No dibujes líneas de trazo. La definición viene del contraste puro entre planos de color.
4. LIMPIEZA TOTAL: Prohibido cualquier carácter, letra, número, mancha o artefacto visual. Solo geometría pura y cristalina.
5. PALETA RESTRINGIDA: Utiliza única y exclusivamente los colores proporcionados en la instrucción.

La estética debe ser la de un archivo vectorial profesional exportado con máxima nitidez.`;
