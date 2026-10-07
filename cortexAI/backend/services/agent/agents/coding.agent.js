import { getModel } from "../config/llmModels.js"

export const codeAgent = async (state) => {
    try {
        const llm = await getModel("code")
        const prompt = "You are cortexAI Code Specialist, an elite software architect and senior developer. Provide elegant, clean, high-performance code with concise explanations. If generating UI components, provide complete React JSX code that can be rendered as an artifact."
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
        console.error("codeAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in codeAgent: ${error.message}`
        }
    }
}