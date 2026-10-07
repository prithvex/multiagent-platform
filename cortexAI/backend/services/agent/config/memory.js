import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
    if (!conversationId || conversationId === "default-conv") return []
    try {
        const key = `messages:${conversationId}`;
        const cached = await redis.get(key)

        if (cached) {
            return JSON.parse(cached)
        }
        // If redis doesn't have the messages then fetch and cache
        const messages = await getMessages(conversationId)
        await redis.set(key, JSON.stringify(messages), "EX", 60 * 60 * 24 * 3)
        return Array.isArray(messages) ? messages : []
    } catch (err) {
        console.warn("getMemory warning:", err.message)
        return []
    }
}

export const addMessage = async (conversationId, message) => {
    if (!conversationId || conversationId === "default-conv") return
    try {
        const key = `messages:${conversationId}`
        const rawMessages = await getMemory(conversationId)
        const messagesList = Array.isArray(rawMessages) ? [...rawMessages] : []
        messagesList.push(message)

        if (messagesList.length > 20) {
            messagesList.shift() // Keep the most recent 20 messages
        }
        await redis.set(key, JSON.stringify(messagesList), "EX", 60 * 60 * 24 * 3)
    } catch (err) {
        console.warn("addMessage warning:", err.message)
    }
}
