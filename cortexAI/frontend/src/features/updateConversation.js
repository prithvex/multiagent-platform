import api from "../../utils/axios"

export const updateConversation = async (conversationId, title) => {
    try {
        const { data } = await api.put("/api/chat/update-conversation", {
            conversationId,
            title
        })
        return data.message || data
    } catch (error) {
        console.error("updateConversation error:", error)
        throw error
    }
}
