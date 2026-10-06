
import Conversation from "../models/conversation.model.js"

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers("x-user-id")
        console.log("userId", userId)

        const conversation = await Conversation.create({
            userId: userId
        })
        return res.status(201).json({ message: conversation })


    } catch (error) {
        return res.status(500).json({ message: `create conversation error ${error}` })
    }
}

export const getConversation = async (req, res) => {
    try {
        const userId = req.headers("x-user-id")
        console.log("userId", userId)

        const conversation = await Conversation.find({
            userId: userId
        }).sort({ createdAt: -1 }).limit(10)
        return res.status(201).json({ message: conversation })


    } catch (error) {
        return res.status(500).json({ message: `get conversation error ${error}` })
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

        return res.status(201).json({ message: conversation })


    } catch (error) {
        return res.status(500).json({ message: `update conversation error ${error}` })
    }
}



export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body
        console.log("conversationId", conversationId)
        console.log("role", role)
        console.log("content", content)

        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content
        })
        return res.status(201).json({ message: message })
    } catch (error) {
        return res.status(500).json({ message: `save message error ${error}` })
    }
}


export const getMessages = async (req, res) => {
    try {
        const message = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 })
        return res.status(201).json({ message: message })
    } catch (error) {
        return res.status(500).json({ message: `get message error ${error}` })
    }
}

