
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, PALETTE } from "../constants.ts";
import { AspectRatio } from "../types.ts";

export const generateGeometricImage = async (
  aspectRatio: AspectRatio, 
  backgroundColor: string,
  dispersion: number,
  centerExclusion: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const apiRatio = aspectRatio === 'A4' ? '3:4' : aspectRatio;

  let dispersionInstruction = "";
  if (dispersion < 30) {
    dispersionInstruction = "Composición: Bloque visual compacto de alto impacto.";
  } else if (dispersion > 70) {
    dispersionInstruction = "Composición: Elementos aislados con máxima claridad espacial.";
  } else {
    dispersionInstruction = "Composición: Equilibrio asimétrico nítido.";
  }

  let exclusionInstruction = "";
  if (centerExclusion > 50) {
    exclusionInstruction = "Ubicación: Centro despejado con enfoque absoluto en los bordes del lienzo.";
  }

  const colorList = Object.values(PALETTE).join(", ");

  const prompt = `TAREA: RENDERIZAR GEOMETRÍA DE ALTA DEFINICIÓN.
  - ESTILO: Vectorial puro, minimalismo de bordes afilados (razor-sharp edges).
  - REGLA DE ORO: Máximo enfoque. Las formas deben ser nítidas y limpias, sin rastro de desenfoque o borrosidad.
  - DETALLE: Solo 4-6 figuras geométricas masivas con bordes de precisión matemática.
  - COLOR: Fondo ${backgroundColor}. Figuras en colores planos: ${colorList}.
  - CALIDAD: Definición cristalina, contraste extremo entre formas.
  ${exclusionInstruction} ${dispersionInstruction}
  
  ADVERTENCIA: Si la imagen contiene una sola letra, número o línea de contorno, el resultado es inválido. Entrega solo la geometría pura.`;

  try {
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
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
