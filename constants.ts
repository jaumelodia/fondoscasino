
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
  { label: 'Personalizado', value: 'custom', icon: 'fa-sliders' },
  { label: 'Cuadrado (1:1)', value: '1:1', icon: 'fa-square' },
  { label: 'Horizontal (16:9)', value: '16:9', icon: 'fa-panorama' },
  { label: 'Vertical (9:16)', value: '9:16', icon: 'fa-mobile-screen' },
  { label: 'Clásico (4:3)', value: '4:3', icon: 'fa-tv' },
  { label: 'Fotografía (3:4)', value: '3:4', icon: 'fa-camera' },
];

export const SYSTEM_INSTRUCTION = `Eres un generador de arte vectorial minimalista estilo Bauhaus.

TUS REGLAS DE DISEÑO:
1. FORMAS: Usa círculos, semicírculos, triángulos equiláteros y rectángulos.
2. ROTACIÓN: Cada figura debe tener un ángulo de giro aleatorio único (0-360°).
3. PROHIBICIÓN TOTAL DE TEXTO Y MARCAS: NO incluyas letras, números, códigos hexadecimales, nombres de colores, firmas ni etiquetas de ningún tipo. La imagen debe estar 100% limpia de caracteres tipográficos.
4. ESTILO: Colores sólidos y planos. Sin sombras ni texturas.`;
