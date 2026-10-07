import { getModel } from "../config/llmModels.js"

export const chatAgent = async (state) => {
    const llm = await getModel("chat")
    const prompt = "You are cortexAI, an intelligent AI assistant"
    const response = await llm.invoke([
        {
            "role": "system",
            "content": prompt,
        },
        {
            "role": "human",
            "content": state.prompt
        }
    ])
    return {
        ...state,
        aiResponse: response.content
    }
}   