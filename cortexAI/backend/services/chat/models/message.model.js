import mongoose from "mongoose";


const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, { _id: false })

const artifactsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    files: {
        type: [fileSchema],
        default: []
    }
})
const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    artifacts: {
        type: [artifactsSchema],
        default: []
    },
    images: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})


const Message = mongoose.model("Message", messageSchema)

export default Message 