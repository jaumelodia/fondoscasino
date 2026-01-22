
export const PALETTE = {
  crema: '#F9F7DD',
  moradoIntenso: '#8A1B61',
  amarilloMostaza: '#F4C82E',
  naranjaCalido: '#E37239',
  moradoMedio: '#9C77B3',
  rosa: '#F09AE4',
  magentaIntenso: '#B24A87',
  verdeMenta: '#9ED1BC',
};

export const ASPECT_RATIO_OPTIONS: { label: string; value: any }[] = [
  { label: 'Cuadrado (1:1)', value: '1:1' },
  { label: 'Horizontal (16:9)', value: '16:9' },
  { label: 'Vertical (9:16)', value: '9:16' },
  { label: 'Clásico (4:3)', value: '4:3' },
  { label: 'Fotografía (3:4)', value: '3:4' },
];

export const SYSTEM_INSTRUCTION = `Eres un motor de renderizado puramente GEOMÉTRICO de ALTO NIVEL. Tu única misión es crear composiciones de color sólido.

REGLAS INNEGOCIABLES (ERROR CRÍTICO SI SE INCUMPLEN):
1. PROHIBICIÓN DE BORDES: NINGUNA figura debe tener contorno, borde, línea perimetral ni trazo (stroke). Las formas deben definirse únicamente por el contraste entre sus colores sólidos. 100% relleno sólido, 0% bordes.
2. PROHIBICIÓN TOTAL DE CARACTERES: No generes letras (A-Z), números (0-9), símbolos de grados (°), códigos hexadecimales (F8A7...), ni etiquetas técnicas. La imagen debe estar 100% limpia de cualquier signo tipográfico.
3. FORMAS LIMPIAS: No incluyas marcas, puntos de anclaje, flechas ni líneas de guía.
4. ESTILO: Minimalismo vectorial puro. Colores planos de la paleta permitida. 

Cualquier línea negra de contorno o cualquier carácter alfanumérico se considera un fallo catastrófico del renderizado.`;
