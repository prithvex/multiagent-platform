import { getModel } from "../config/llmModels.js"

export const pdfAgent = async (state) => {

    try {
        // add check here
        await checkAgentLimit(state.userId, "pdf")
        const llm = await getModel("pdf")
        const prompt = `
    You are cortexAI PDF & Document Specialist. Assist with document structure, report synthesis, data extraction, and executive summaries.
            
    USER Request:
    ${state.prompt} `

        // send the prompt to llm 
        const response = await llm.invoke(prompt)
        const data = JSON.parse(response)
        const pdfBuffer = await generatepdf(data)
        const filename = `cortexai-pdf-${Date.now()}.pdf`

        const uploadUrl = await uploadtos3(filename, pdfBuffer, "application/pdf", 24 * 60 * 60)

        const downloadUrl = await getFromS3(filename, 60 * 24)

        return {
            ...state,
            // how output is done
            aiResponse: response.content + "\n [Download PDF] " + downloadUrl
        }
    } catch (error) {
        console.error("pdfAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in pdfAgent: ${error.message}`
        }
    }
}