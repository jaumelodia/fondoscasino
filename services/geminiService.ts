
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, PALETTE } from "../constants";
import { AspectRatio } from "../types";

export const generateGeometricImage = async (
  aspectRatio: AspectRatio, 
  backgroundColor: string,
  dispersion: number,
  centerExclusion: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let dispersionInstruction = "";
  if (dispersion < 30) {
    dispersionInstruction = "Composición: Bloque visual macizo y compacto, con formas solapándose agresivamente sin dejar espacios.";
  } else if (dispersion > 70) {
    dispersionInstruction = "Composición: Formas muy esparcidas por el lienzo con posiciones totalmente impredecibles.";
  } else {
    dispersionInstruction = "Composición: Distribución orgánica y asimétrica.";
  }

  let exclusionInstruction = "";
  if (centerExclusion === 0) {
    exclusionInstruction = "Ubicación: Libertad total, las formas pueden cubrir el centro del lienzo.";
  } else if (centerExclusion < 50) {
    exclusionInstruction = "Ubicación: Desplazamiento irregular hacia fuera del centro, permitiendo solapamientos asimétricos.";
  } else {
    exclusionInstruction = "Ubicación: El centro exacto debe estar vacío. Coloca las figuras solo en los márgenes y esquinas.";
  }

  const colorList = Object.values(PALETTE).join(", ");

  const prompt = `GENERACIÓN DE ARTE GEOMÉTRICO (REGLAS ESTRICTAS):
  - NO BORDES: Prohibido dibujar contornos, líneas negras o bordes alrededor de las figuras. Las formas son solo áreas de color sólido.
  - NO TEXTO: Prohibido incluir letras, números, símbolos o códigos. No incluyas identificadores como "F8A7248" ni medidas.
  - FORMAS: Solo 4-6 figuras masivas (círculos, rectángulos, triángulos) con rellenos planos.
  - COLORES: Fondo ${backgroundColor}. Figuras usando exclusivamente: ${colorList}.
  - ESTILO: Minimalismo vectorial nítido. Sin sombras, sin degradados, sin bordes.
  - PARÁMETROS: ${exclusionInstruction} | ${dispersionInstruction}
  
  IMPORTANTE: No etiquetes nada. No escribas nada. No dibujes líneas de contorno. Solo geometría de color sólido.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
