import { getModel } from "../config/llmModels.js"

export const pptAgent = async (state) => {
    try {
        const llm = await getModel("ppt")
        const prompt = "You are cortexAI Presentation Specialist. Create compelling slide outlines, narrative structures, speaker notes, and presentation slide decks."
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
        console.error("pptAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in pptAgent: ${error.message}`
        }
    }
}