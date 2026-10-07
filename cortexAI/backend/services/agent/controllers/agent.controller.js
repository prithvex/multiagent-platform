import axios from "axios"

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body
        await axios.post(`${process.env.CHAT_SERVICE}/save-Message`, {
            conversationId: conversationId,
            role: "user",
            content: prompt
        })
        const result = await graph.invoke({
            prompt: prompt,
            conversationId: conversationId,
        })

        const response = result.aiResponse
        return res.status(200).json({ response: response })

    } catch (error) {
        return res.status(500).json({ message: `agent error ${error}` })
    }
}