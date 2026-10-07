import { redis } from "../config/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
    const key = `messages:${conversationId}`;
    const catched = await redis.get(key)

    if (catched) {
        return JSON.parse(catched)
    }
    //if redis dont have the messages then add the message into redis 
    const messages = await getMessages(conversationId)
    await redis.set(key, JSON.stringify(messages), "EX", 60 * 60 * 24 * 3)
    return messages
}

export const addMessage = async (conversationId, message) => {
    const key = `messages:${conversationId}`
    const rawMessages = await getMemory(conversationId)
    const parsedMessages = JSON.parse(rawMessages)
    parsedMessages.push(message)

    if (parsedMessages.length > 20) {
        parsedMessages.shift() // remove the first message only 
    }
    await redis.set(key, JSON.stringify(parsedMessages), "EX", 60 * 60 * 24 * 3)


}   