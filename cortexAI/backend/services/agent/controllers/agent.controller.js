import axios from "axios"
import { graph } from "../graph/graph.js"

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body
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
        })

        const response = result?.aiResponse || "No response received from agent."

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
            agent: result?.agent || "chat"
        })

    } catch (error) {
        console.error("agent controller error:", error)
        return res.status(500).json({ message: `agent error: ${error.message || error}` })
    }
}