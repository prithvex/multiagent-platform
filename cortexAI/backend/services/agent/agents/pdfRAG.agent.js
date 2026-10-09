import fs from "fs"
import pdfParse from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getModel } from "../config/llmModels";
import { SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRAG = async (state) => {

    try {
        // add check here
        await checkAgentLimit(state.userId, "pdf")
        const buffer = fs.readFileSync(state.file.path)
        const pdf = new pdfParse(buffer)

        const text = pdf.getText()

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
        const docs = splitter.createDocuments([text])

        const collectionName = `pdf- ${Date.now()}`

        const store = await vectorStore(docs, collectionName)

        // similarity search in the store 
        const relevantChunks = await store.similaritySearch(state.prompt, 5)
        const context = relevantChunks.map((doc) => doc.pageContent).join("\n\n")

        const llm = await getModel("pdfRAG")
        const messages = [
            new SystemMessage(`
            You are a helpful assistant that answers questions about the provided context.
            Context: ${context}
            Question: ${state.prompt}
            If context does not have the answer return false 
            Return only json with required 
            `),

            new HumanMessage(`
                context:${context} 
                question: ${state.prompt}        
                `)
        ]

        const response = await llm.invoke(messages)
        //deduct credits
        await deductCredits(state.userId, "pdf")

        return {
            ...state,
            aiResponse: response?.content || "No response from pdfRAG"
        }

    } catch (error) {
        console.error("pdfRAG error:", error)
        return {
            ...state,
            aiResponse: `Error in pdfRAG: ${error.message}`
        }
    }
    finally {
        fs.unlink(state.file.path)
    }
}