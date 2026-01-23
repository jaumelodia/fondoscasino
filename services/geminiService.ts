
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
    dispersionInstruction = "Composición: Figuras masivas superpuestas en el centro.";
  } else if (dispersion > 70) {
    dispersionInstruction = "Composición: Formas gigantes que se extienden hasta los bordes del lienzo.";
  } else {
    dispersionInstruction = "Composición: Equilibrio de bloques de gran escala.";
  }

  let exclusionInstruction = "";
  if (centerExclusion > 50) {
    exclusionInstruction = "Ubicación: Centro vacío, figuras gigantes desplazadas hacia los laterales.";
  }

  const colorList = Object.values(PALETTE).join(", ");

  const prompt = `TAREA: GENERAR COMPOSICIÓN GEOMÉTRICA DE BLOQUES MASIVOS.
  - ESTILO: Abstracción geométrica pura, bordes afilados sin trazo.
  - REQUISITO CRÍTICO: PROHIBIDO EL USO DE LÍNEAS NEGRAS O CONTORNOS. Las figuras no tienen borde.
  - FORMAS: Solo 3-5 polígonos o círculos GIGANTES y ALEATORIOS que ocupen gran parte del lienzo.
  - COLOR: Fondo liso color ${backgroundColor}. Formas en colores sólidos: ${colorList}.
  - PROHIBICIÓN: Cero texto, cero números, cero símbolos. Solo planos de color.
  
  ${exclusionInstruction} ${dispersionInstruction}
  
  RECUERDA: Si añades un borde negro o un trazo de línea, la imagen será rechazada. Busca la pureza del plano de color.`;

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
