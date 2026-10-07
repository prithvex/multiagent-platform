import { getModel } from "../config/llmModels.js"

export const router = async (state) => {
    const llm = await getModel("router")
    const routerPrompt = `
You are an AI Agent Router.

Your job is to analyze the user's request and decide which agent should handle it.

Available agents:

- chat: General conversation, questions, explanations, brainstorming, advice, and tasks that don't require a specialized agent.
- image: Requests to generate, edit, analyze, describe, or work with images.
- pdf: Requests involving PDF creation, reading, extraction, summarization, analysis, or modification.
- ppt: Requests involving PowerPoint/presentation creation, editing, structuring, or analysis.
- code: Programming, debugging, code generation, code review, software architecture, APIs, databases, or technical implementation.
- search: Requests that require web search, current information, fact checking, finding websites/products/people, or researching external information.

Routing rules:

1. Return exactly ONE agent.
2. Choose based on the user's PRIMARY intent.
3. Do not choose an agent based only on keywords.
4. If the user asks for code, choose "code" even if the task also requires research.
5. If the user asks to create or modify an image, choose "image".
6. If the request primarily involves a PDF, choose "pdf".
7. If the request primarily involves a PowerPoint or presentation file, choose "ppt".
8. If the user explicitly needs current/external information or web research, choose "search".
9. For normal questions and conversation, choose "chat".
10. Never return multiple agents.
11. If unsure between agents, choose "chat".

Return ONLY one of these exact values:

chat
image
pdf
ppt
code
search

User Query:
${state.prompt}
`;

    try {
        const response = await llm.invoke(routerPrompt)
        console.log("Router decision:", response?.content)
        const agentName = (response?.content || "chat").toLowerCase().trim()
        return {
            ...state,
            agent: agentName
        }
    } catch (err) {
        console.warn("Router LLM failed, defaulting to chat:", err.message)
        return {
            ...state,
            agent: "chat"
        }
    }
}