import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Servicio de IA para Castelia Studio.
 * Analiza el prompt del usuario y extrae filtros estructurados.
 * Arquitectura: Utiliza gemini-2.5-flash para optimizar la latencia
 * y maximizar la cuota de peticiones por minuto.
 */
export const extractFiltersFromPrompt = async (userPrompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('La variable GEMINI_API_KEY no está definida en el entorno.');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Actualizado al modelo 2.5-flash: el balance ideal entre precisión para JSON y velocidad.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemInstruction = `
            Actúa como un extractor de datos estricto para Castelia Studio.
            Tu objetivo es transformar el lenguaje natural en un objeto JSON de filtros para una base de datos de bienes raíces.

            Reglas:
            1. Responde UNICAMENTE el objeto JSON puro.
            2. Si no se menciona un valor, establécelo como null.
            3. Los precios deben ser números.

            Estructura:
            {
                "minPrice": número o null,
                "maxPrice": número o null,
                "region": "nombre" o null,
                "intent": "resumen breve de la intención"
            }

            Entrada del usuario: "${userPrompt}"
        `;

        const result = await model.generateContent(systemInstruction);
        const response = await result.response;
        const text = response.text();

        // Sanitización estricta: eliminamos markdown residual si el LLM lo incluye
        const jsonString = text.replace(/```json|```/gi, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        // Log detallado para trazabilidad en el servidor
        console.error("[aiService] Error en la capa de IA:", error.message);
        
        // Propagamos el error de forma controlada
        throw new Error(`Fallo en el procesamiento de lenguaje natural: ${error.message}`);
    }
};