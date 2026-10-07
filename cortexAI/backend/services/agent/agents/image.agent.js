import { getModel } from "../config/llmModels.js"

export const imageGenAgent = async (state) => {
    try {
        const llm = await getModel("image")
        const prompt = "You are cortexAI Vision & Creative Agent. Analyze image/visual requests, describe visual scenes in vivid detail, output SVG graphics or canvas specifications when requested, and provide aesthetic design guidance."
        const response = await llm.invoke([
            {
                role: "system",
                content: prompt,
            },
            {
                role: "human",
                content: state.prompt
            }
        ])
        return {
            ...state,
            aiResponse: response.content
        }
    } catch (error) {
        console.error("imageGenAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in imageGenAgent: ${error.message}`
        }
    }
}