import api from "../../utils/axios"

export const getMessages = async (conversationId) => {
    if (!conversationId) return []
    try {
        const { data } = await api.get(`/api/chat/get-message/${conversationId}`)
        return Array.isArray(data.message) ? data.message : (Array.isArray(data.messages) ? data.messages : [])
    } catch (error) {
        console.error("getMessages error:", error)
        return []
    }
}
