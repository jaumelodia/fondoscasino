
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

export const SYSTEM_INSTRUCTION = `Eres un motor de renderizado GEOMÉTRICO ABSTRACTO de precisión absoluta. Tu única tarea es crear composiciones de planos de color puro.

REGLAS DE ORO INNEGOCIABLES:
1. SIN BORDES NI CONTORNOS: Está TERMINANTEMENTE PROHIBIDO dibujar líneas de trazo, bordes o contornos negros alrededor de las figuras. Las formas se definen exclusivamente por donde termina un color y empieza otro.
2. FIGURAS GIGANTES: Genera solo 3 a 5 formas geométricas MASIVAS y grandes. No crees patrones pequeños ni detallados.
3. COLORES PLANOS: Cada forma debe ser un bloque de color sólido al 100%. Sin degradados, sin sombras, sin texturas.
4. LIMPIEZA ABSOLUTA: No incluyas letras, números, símbolos, motas de polvo ni firmas. Si aparece un solo carácter, el renderizado es un fracaso.
5. CONTRASTE PURO: El enfoque debe ser "razor-sharp" (afilado como una cuchilla) en la unión de los colores.

Estética: Minimalismo Bauhaus vectorial. El resultado debe parecer un recorte de papel perfecto pegado sobre otro papel.`;
