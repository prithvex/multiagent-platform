import "dotenv/config"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

let groqInstance = null
let geminiInstance = null

const getGroq = () => {
    if (!groqInstance) {
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            console.warn("GROQ_API_KEY is not defined in environment variables!")
        }
        groqInstance = new ChatGroq({
            apiKey: apiKey,
            model: "openai/gpt-oss-120b",
            temperature: 0.2,
            maxRetries: 2,
        })
    }
    return groqInstance
}

const getGemini = () => {
    if (!geminiInstance) {
        const apiKey = process.env.GOOGLE_API_KEY
        if (!apiKey) {
            console.warn("GOOGLE_API_KEY is not defined in environment variables!")
        }
        geminiInstance = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: "gemini-3.6-flash",
            temperature: 0.2,
            maxRetries: 2,
        })
    }
    return geminiInstance
}

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return getGroq()
        case "image":
            return getGemini()
        case "pdf":
            return getGemini()
        case "ppt":
            return getGemini()
        case "code":
            return getGemini()
        case "search":
            return getGroq()
        default:
            return getGroq()
    }
}