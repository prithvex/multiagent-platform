import { SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"

export const chatAgent = async (state) => {
    const llm = await getModel("chat")

    const history = await getMemory(state.conversationId)
    const systemPrompt = `
    You are a ${state.agent}.`

    const messages = [
        new SystemMessage(systemPrompt),

    ]

    history.forEach(msg => {
        if (msg.role == "user") {
            messages.push(new HumanMessage(msg.content))
        }
        else if (msg.role == "assistant") {
            messages.push(new AIMessage(msg.content))
        }
    });

    //push the prompt 
    messages.push(new HumanMessage(state.prompt))
    console.log(messages)

    const response = await llm.invoke([
        {
            "role": "system",
            "content": systemPrompt,
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