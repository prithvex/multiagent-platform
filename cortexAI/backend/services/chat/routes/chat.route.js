import express from "express"
import { createConversation, getConversation, updateConversation, saveMessage, getMessages, deleteConversation }
    from "../controllers/chat.controller.js"

const router = express.Router()

router.post("/create-conversation", createConversation)
router.get("/get-conversation", getConversation)
router.put("/update-conversation", updateConversation)
router.delete("/delete-conversation/:conversationId", deleteConversation)
router.post("/save-message", saveMessage)
router.get("/get-message/:conversationId", getMessages)

export default router