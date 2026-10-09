import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"

export const agent = async (req, res, next) => {
    try {
        const { prompt, conversationId } = req.body
        //get the file 
        const file = req.file

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" })
        }


        // Save user message to chat service if conversationId is provided
        if (conversationId && conversationId !== "default-conv") {
            try {
                await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                    conversationId: conversationId,
                    role: "user",
                    content: prompt
                })
            } catch (err) {
                console.warn("Could not save user message to chat service:", err.message)
            }
        }

        const result = await graph.invoke({
            prompt: prompt,
            conversationId: conversationId || "default-conv",
            userId: req.userId,
            file: file
        })

        const response = result?.aiResponse || "No response received from agent."

        // Cache user and assistant messages in memory
        if (conversationId && conversationId !== "default-conv") {
            await addMessage(conversationId, {
                role: "user",
                content: prompt,
            })
            await addMessage(conversationId, {
                role: "assistant",
                content: response,
            })
        }

        // Save assistant message to chat service if conversationId is provided
        if (conversationId && conversationId !== "default-conv") {
            try {
                await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                    conversationId: conversationId,
                    role: "assistant",
                    content: response
                })
            } catch (err) {
                console.warn("Could not save assistant message to chat service:", err.message)
            }
        }

        return res.status(200).json({
            response: response,
            agent: result?.agent || "chat",
            searchResults: result?.searchResults || [],
            images: result?.images || [],
            artifacts: result?.artifacts || [],
        })

    } catch (error) {
        next(error)
    }
}