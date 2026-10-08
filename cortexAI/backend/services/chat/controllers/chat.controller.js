
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

        if (!userId) {
            return res.status(200).json({ message: [] })
        }

        const allConversations = await Conversation.find({
            userId: userId
        }).sort({ createdAt: -1 })

        // Filter and clean up empty abandoned conversations that have no messages
        const validConversations = []
        for (const conv of allConversations) {
            const hasMessages = await Message.exists({ conversationId: conv._id })
            if (hasMessages) {
                validConversations.push(conv)
            } else {
                // Delete orphaned conversation with 0 messages from MongoDB
                await Conversation.findByIdAndDelete(conv._id)
            }
        }

        return res.status(200).json({ message: validConversations })

    } catch (error) {
        console.error("getConversation error:", error)
        return res.status(500).json({ message: `get conversation error ${error.message || error}` })
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params
        await Conversation.findByIdAndDelete(conversationId)
        await Message.deleteMany({ conversationId: conversationId })
        return res.status(200).json({ message: "Conversation deleted successfully" })
    } catch (error) {
        console.error("deleteConversation error:", error)
        return res.status(500).json({ message: `delete conversation error ${error.message || error}` })
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
        const { conversationId, role, content, images = [] } = req.body
        console.log("saveMessage:", { conversationId, role, contentLength: content?.length })

        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content,
            images: [],
            artifacts: artifacts,
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

