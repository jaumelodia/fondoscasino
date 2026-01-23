
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, PALETTE } from "../constants.ts";
import { AspectRatio } from "../types.ts";

export const generateGeometricImage = async (
  aspectRatio: AspectRatio, 
  backgroundColor: string,
  dispersion: number,
  centerExclusion: number
): Promise<string> => {
  // Inicialización limpia según guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const apiRatio = aspectRatio === 'A4' ? '3:4' : aspectRatio;

  const colorList = Object.values(PALETTE).filter(c => c !== backgroundColor).join(", ");

  const prompt = `COMPOSICIÓN DE PLANOS MASIVOS:
  - FONDO: Un plano sólido de color ${backgroundColor}.
  - FIGURAS: Superpone 3 bloques geométricos GIGANTES que se corten entre sí.
  - COLORES DE FIGURAS: Usa exclusivamente estos colores: ${colorList}.
  - BORDE: Grosor de borde 0. Sin líneas negras. Sin contornos.
  - LIMPIEZA: Absolutamente nada de texto, números o símbolos.
  
  Configuración adicional:
  Dispersion: ${dispersion}% (determina cuánto se alejan los planos del centro).
  Center Exclusion: ${centerExclusion}% (determina el espacio vacío en el eje central).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }],
    },
    config: {
      imageConfig: {
        aspectRatio: apiRatio as any,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in response");
};
