import { getModel } from "../config/llmModels.js"

export const searchAgent = async (state) => {
    try {
        const llm = await getModel("search")
        const prompt = "You are cortexAI Deep Research & Web Agent. Synthesize information, cite key insights, perform structured analysis, and provide accurate, factual summaries."
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
        console.error("searchAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in searchAgent: ${error.message}`
        }
    }
}