import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.type.ObjectId,
        ref: conversation,
        unique: true
    },
    role: [
        {
            type: String,
            enum: ["user", "assistant"],
        },
        content = String,
    ]
}, {
    timestamps: true
})

const Conversation = mongoose.model("Conversation", messageSchema)


export default messageSchema 