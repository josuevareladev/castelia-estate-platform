import * as aiService from '../services/aiService.js';
import Property from '../models/Property.js';

/**
 * Controlador principal del Agente de IA.
 * Orquestra el flujo: Prompt -> Filtros (IA) -> Búsqueda (DB) -> Respuesta.
 */
export const processAgentQuery = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'El prompt es requerido para procesar la búsqueda.'
            });
        }

        // 1. Extraer filtros estructurados usando el servicio de IA (Gemini 2.5 Flash)
        const filters = await aiService.extractFiltersFromPrompt(prompt);

        // 2. Construcción dinámica de la query de MongoDB
        // Iniciamos un objeto vacío y solo agregamos condiciones si la IA las detectó
        const mongoQuery = {};

        // Lógica de filtrado por rango de precio
        if (filters.minPrice !== null || filters.maxPrice !== null) {
            mongoQuery.price = {};
            if (filters.minPrice !== null) mongoQuery.price.$gte = filters.minPrice;
            if (filters.maxPrice !== null) mongoQuery.price.$lte = filters.maxPrice;
        }

        // Lógica de filtrado geográfico (normalizado a minúsculas)
        // Antes decía .toLowerCase(), asegúrate de que no tenga lógica que fuerce español
        if (filters.region) {
            mongoQuery.region = filters.region.toLowerCase();
        }

        // 3. Ejecución de la consulta en la base de datos
        // Usamos .lean() para mejorar el rendimiento al obtener objetos JS planos
        const properties = await Property.find(mongoQuery).lean().sort({ price: 1 });

        // 4. Respuesta estructurada al cliente
        return res.status(200).json({
            success: true,
            message: filters.intent || 'Búsqueda procesada con éxito',
            count: properties.length,
            filters, // Enviamos los filtros para que el Frontend pueda mostrarlos (ej: chips)
            data: properties // Aquí viajan las Art Cards que se renderizarán
        });

    } catch (error) {
        console.error('❌ Error en processAgentQuery:', error.message);

        return res.status(500).json({
            success: false,
            error: 'Error interno al procesar la solicitud del agente.',
            details: error.message
        });
    }
};