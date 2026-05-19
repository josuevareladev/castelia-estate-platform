import { GoogleGenerativeAI } from '@google/generative-ai';

export const semanticSearch = async (userPrompt, inventoryData) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is not defined.');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemInstruction = `
            Act as a highly advanced semantic search engine for a real estate platform.
            You will be provided with a User Prompt and a JSON array of Available Properties.
            Your objective is to analyze the semantic meaning of the User Prompt and find the properties that best match the user's needs, desires, and constraints.

            Available Properties:
            ${JSON.stringify(inventoryData)}

            User Prompt: "${userPrompt}"

            Rules:
            1. Return ONLY a valid JSON array of strings, where each string is the "_id" of a matching property.
            2. Do not include any markdown, explanations, or additional text. Just the JSON array.
            3. If no properties match the criteria semantically, return an empty array [].
            4. Consider synonyms, lifestyle requirements (e.g., "dogs" matches "pet-friendly"), and implicit needs.
        `;

        const result = await model.generateContent(systemInstruction);
        const response = await result.response;
        const text = response.text();

        // Strict sanitization: remove markdown formatting if the LLM includes it
        const jsonString = text.replace(/```json|```/gi, '').trim();
        const matchedIds = JSON.parse(jsonString);

        if (!Array.isArray(matchedIds)) {
            throw new Error("AI did not return a valid array of IDs.");
        }

        return matchedIds;

    } catch (error) {
        console.error("[aiService] Semantic Search Error:", error.message);
        throw new Error(`AI processing failed: ${error.message}`);
    }
};