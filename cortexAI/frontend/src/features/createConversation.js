import api from "../../utils/axios"

export const createconversation = async () => {
    try {
        const { data } = await api.post("/api/chat/create-conversation")
        return data.message || data
    } catch (error) {
        console.error("createConversation error:", error)
        return null
    }
}