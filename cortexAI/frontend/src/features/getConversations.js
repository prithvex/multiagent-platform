import api from "../../utils/axios"

export const getconversation = async () => {
    try {
        const { data } = await api.get("/api/chat/get-conversation")
        return Array.isArray(data.message) ? data.message : (Array.isArray(data) ? data : [])
    } catch (error) {
        console.error("getConversation error:", error)
        return []
    }
}
