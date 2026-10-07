import api from "../../utils/axios"

export const sendAgentMessage = async (prompt, conversationId) => {
    try {
        const { data } = await api.post("/api/agent/chat", {
            prompt,
            conversationId
        })
        return data
    } catch (error) {
        console.error("sendAgentMessage error:", error)
        throw error
    }
}
