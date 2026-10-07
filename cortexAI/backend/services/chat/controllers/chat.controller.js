
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"] || (typeof req.header === "function" ? req.header("x-user-id") : null)
        console.log("createConversation userId:", userId)

        const conversation = await Conversation.create({
            userId: userId
        })
        return res.status(201).json({ message: conversation })

    } catch (error) {
        console.error("createConversation error:", error)
        return res.status(500).json({ message: `create conversation error ${error.message || error}` })
    }
}

export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"] || (typeof req.header === "function" ? req.header("x-user-id") : null)
        console.log("getConversation userId:", userId)

        const conversation = await Conversation.find({
            userId: userId
        }).sort({ createdAt: -1 }).limit(20)
        return res.status(200).json({ message: conversation })

    } catch (error) {
        console.error("getConversation error:", error)
        return res.status(500).json({ message: `get conversation error ${error.message || error}` })
    }
}

export const updateConversation = async (req, res) => {
    try {
        const { conversationId, title } = req.body
        const conversation = await Conversation.findByIdAndUpdate(conversationId, {
            title: title
        }, {
            new: true
        })

        return res.status(200).json({ message: conversation })

    } catch (error) {
        console.error("updateConversation error:", error)
        return res.status(500).json({ message: `update conversation error ${error.message || error}` })
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body
        console.log("saveMessage:", { conversationId, role, contentLength: content?.length })

        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content
        })
        return res.status(201).json({ message: message })
    } catch (error) {
        console.error("saveMessage error:", error)
        return res.status(500).json({ message: `save message error ${error.message || error}` })
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 })
        return res.status(200).json({ message: messages, messages: messages })
    } catch (error) {
        console.error("getMessages error:", error)
        return res.status(500).json({ message: `get message error ${error.message || error}` })
    }
}

