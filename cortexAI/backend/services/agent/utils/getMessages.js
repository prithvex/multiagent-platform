import axios from "axios";

export const getMessages = async (conversationId) => {
    if (!conversationId || conversationId === "default-conv") return [];
    try {
        const { data } = await axios.get(`${process.env.CHAT_SERVICE}/get-message/${conversationId}`)
        return Array.isArray(data?.message) ? data.message : (Array.isArray(data?.messages) ? data.messages : []);
    } catch (error) {
        console.warn("Could not retrieve messages for memory:", error.message)
        return [];
    }
}