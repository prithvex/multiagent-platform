import { getModel } from "../config/llmModels.js"

export const pdfAgent = async (state) => {
    try {
        const llm = await getModel("pdf")
        const prompt = "You are cortexAI PDF & Document Specialist. Assist with document structure, report synthesis, data extraction, and executive summaries."
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
        console.error("pdfAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in pdfAgent: ${error.message}`
        }
    }
}