import api from "../../utils/axios"

export const deleteConversation = async (conversationId) => {
    if (!conversationId) return null
    try {
        const { data } = await api.delete(`/api/chat/delete-conversation/${conversationId}`)
        return data
    } catch (error) {
        console.error("deleteConversation error:", error)
        throw error
    }
}
