import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const chatAgent = async (state) => {

    try {
        // add check here
        await checkAgentLimit(state.userId, "chat")

        const llm = await getModel("chat")

        const history = (await getMemory(state.conversationId)) || []
        const systemPrompt = `You are cortexAI, an intelligent, helpful, and versatile AI assistant.`

        const messages = [
            new SystemMessage(systemPrompt),
        ]

        if (Array.isArray(history)) {
            history.forEach(msg => {
                if (msg.role === "user") {
                    messages.push(new HumanMessage(msg.content))
                } else if (msg.role === "assistant") {
                    messages.push(new AIMessage(msg.content))
                }
            })
        }

        // Check if searchResults are present in state (from searchAgent)
        let userContent = state.prompt;
        if (state.searchResults && (Array.isArray(state.searchResults) ? state.searchResults.length > 0 : Object.keys(state.searchResults).length > 0)) {
            const searchContent = typeof state.searchResults === "string"
                ? state.searchResults
                : JSON.stringify(state.searchResults, null, 2);

            userContent = `User Question: ${state.prompt}\n\nWeb Search Results:\n${searchContent}\n\nPlease synthesize a comprehensive, accurate, and up-to-date response based on the search results above. Include citations and markdown links where helpful.`;
        }

        // Push the current user prompt
        messages.push(new HumanMessage(userContent))

        const response = await llm.invoke(messages)

        //call this into all agents who are generating responses
        await deductCredits(state.userId, "chat")




        return {
            ...state,
            aiResponse: response.content
        }
    } catch (error) {
        console.error("chatAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in chatAgent: ${error.message}`
        }
    }
}   