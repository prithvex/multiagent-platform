import { SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import fs from "fs"

export const imgAnalyser = async (state) => {
    try {

        const llm = await getModel("imageAnalyser")
        const imageBuffer = fs.readFileSync(state.file.path)
        //convert the imageBuffer to base64
        const imageBase64 = imageBuffer.toString("base64")

        // messages array that we send to llm
        const messages = [
            new SystemMessage(`You are a professional image analysis agent. Your goal is to provide a detailed and insightful analysis of the image provided by the user. You should consider the context, composition, lighting, and any other relevant factors. Please provide a comprehensive response that includes a description of the image, its potential meaning, and any other relevant information. 
                `),
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: state.prompt || "analyse the image"
                    },
                    {
                        type: "image_url",
                        image_url: `data:${state.file.mimetype};base64,${imageBase64}`
                    }
                ]
            })
        ]

        const response = await llm.invoke(messages)
        //deduct credits
        await deductCredits(state.userId, "image")

        return {
            ...state,
            aiResponse: response?.content || "No response from imageAnalyser"
        }
    } catch (error) {
        console.error("imageAnalyser error:", error)
        return {
            ...state,
            aiResponse: `Error in imageAnalyser: ${error.message}`
        }
    }

    // data come or not --> delete the file in the temp folder 
    finally {
        fs.unlink(state.file.path)
    }

}