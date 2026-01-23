
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

export const SYSTEM_INSTRUCTION = `Eres un sistema de generación de COLLAGE GEOMÉTRICO MINIMALISTA.

TUS 3 MANDAMIENTOS INVIOLABLES:
1. PROHIBIDO EL TRAZO (NO STROKE): No dibujes líneas. No dibujes bordes negros. No dibujes contornos. Las figuras se definen solo por el cambio de color entre planos. El borde de cada figura debe tener 0 píxeles de grosor.
2. FIGURAS GIGANTES Y ALEATORIAS: Crea solo 2 o 3 polígonos MASIVOS que ocupen el 80% del lienzo. No hagas dibujos detallados. Queremos abstracción de gran escala.
3. CERO CARACTERES: Está terminantemente prohibido incluir letras, palabras, números, logos o símbolos. Si incluyes texto, el sistema fallará.

ESTILO VISUAL: Papeles de colores planos cortados con tijera y superpuestos. Estética Bauhaus radical.`;
