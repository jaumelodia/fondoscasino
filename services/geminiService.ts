
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, PALETTE } from "../constants.ts";
import { AspectRatio } from "../types.ts";

export const generateGeometricImage = async (
  aspectRatio: AspectRatio, 
  backgroundColor: string,
  dispersion: number,
  centerExclusion: number,
  shapeSize: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const apiRatio = aspectRatio === 'A4' ? '3:4' : aspectRatio;
  
  // Obtenemos nombres de colores en lugar de los códigos hex para el prompt, 
  // para evitar que la IA los escriba en la imagen.
  const colorNames = Object.keys(PALETTE).filter(k => (PALETTE as any)[k] !== backgroundColor).join(", ");

  // Estrategia de Vacío Central
  let spatialStrategy = "";
  if (centerExclusion > 70) {
    spatialStrategy = `
      - REGLA DE ESPACIO: VACÍO CENTRAL TOTAL. 
      - Prohibido colocar cualquier objeto en el área central del lienzo. 
      - Empuja TODAS las figuras hacia los bordes extremos y las 4 esquinas.
      - El centro debe ser un espacio negativo puro de color ${backgroundColor}.`;
  } else if (centerExclusion > 30) {
    spatialStrategy = "Distribuye las formas en la periferia, evitando el eje central vertical y horizontal.";
  } else {
    spatialStrategy = "Composición libre y equilibrada en todo el lienzo.";
  }

  // Estrategia de Dispersión
  let dispersionStrategy = "";
  if (dispersion > 70) {
    dispersionStrategy = "MÁXIMA DISPERSIÓN: Las figuras deben estar muy separadas entre sí. No permitas que se toquen. Colócalas en puntos opuestos del lienzo.";
  } else if (dispersion < 30) {
    dispersionStrategy = "AGRUPACIÓN: Crea un conjunto compacto donde las figuras se solapen en una única zona de interés.";
  }

  // Estrategia de Tamaño
  let sizeStrategy = "";
  if (shapeSize < 30) {
    sizeStrategy = "TAMAÑO: Figuras muy pequeñas, sutiles y discretas, actuando como acentos minimalistas.";
  } else if (shapeSize > 70) {
    sizeStrategy = "TAMAÑO: Figuras muy grandes, audaces y dominantes que ocupan gran parte del lienzo y se cortan significativamente en los bordes.";
  } else {
    sizeStrategy = "TAMAÑO: Figuras de tamaño medio y equilibrado.";
  }

  const prompt = `GENERAR COMPOSICIÓN GEOMÉTRICA MINIMALISTA:
  - FONDO: Color sólido ${backgroundColor}.
  - ELEMENTOS: 4 a 6 figuras geométricas (usa estos colores: ${colorNames}).
  - DINAMISMO: Cada figura debe tener una rotación e inclinación aleatoria y diferente.
  
  REGLAS DE DISEÑO:
  ${spatialStrategy}
  ${dispersionStrategy}
  ${sizeStrategy}

  REGLA DE SEGURIDAD (CRÍTICO):
  - NO ESCRIBAS NADA. No incluyas nombres de colores, ni los códigos hex, ni etiquetas. 
  - La imagen no debe contener NINGÚN carácter de texto, ni símbolos, ni letras. 
  - Solo formas geométricas puras de colores planos sin bordes.`;

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

  throw new Error("No se pudo obtener la imagen del modelo.");
};
