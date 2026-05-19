import * as aiService from '../services/aiService.js';
import Property from '../models/Property.js';

export const processAgentQuery = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            const error = new Error('A prompt is required to process the search.');
            error.statusCode = 400;
            throw error;
        }

        // 1. Fetch lightweight inventory (only text fields, excluding heavy image arrays)
        // Complexity: O(1) bandwidth optimization
        const inventoryLight = await Property.find({})
            .select('_id title description price region features')
            .lean();

        if (inventoryLight.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        // 2. Pass prompt and lightweight inventory to the AI for semantic reasoning
        const matchedIds = await aiService.semanticSearch(prompt, inventoryLight);

        // 3. If the AI found no matches, return early
        if (!matchedIds || matchedIds.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        // 4. Rehydrate the matched properties with their full data
        const fullProperties = await Property.find({
            _id: { $in: matchedIds }
        }).lean();

        // 5. Structured response to the client
        return res.status(200).json({
            success: true,
            count: fullProperties.length,
            data: fullProperties
        });

    } catch (error) {
        next(error); // Passes the error to our robust errorHandler middleware
    }
};