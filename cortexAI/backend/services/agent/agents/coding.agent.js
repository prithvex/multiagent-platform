import { getModel } from "../config/llmModels.js"

export const codeAgent = async (state) => {
    try {
        const intentLLM = await getModel("intent")
        const llm = await getModel("code")
        const intentResponse = await intentLLM.invoke(`You are an intent classifier.

        Return ONLY one of these values:
        CODE GENERATION
        CODE REVIEW
        CODE EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request:
        ${state.prompt}
`)
        const intent = intentResponse.content.trim().toUpperCase()
        console.log("intent :", intent)
        if (intent == "CODE_GENERATION") {
            const prompt = `
You are an expert coding assistant. Your task is to generate **clean, efficient, and production-ready code** based on the user's request.

### INSTRUCTIONS:
1.  **Analyze the Request**: Determine the programming language, framework, libraries, and overall architecture needed.
2.  **Generate Code**: Write the code snippet, function, class, or complete program as required.
3.  **Best Practices**: Ensure the code follows standard coding conventions, is well-commented, and follows best practices for the specific language/framework.
4.  **Completeness**: If the request implies a full application or component, provide all necessary parts (imports, setup, main logic, exports).

### USER REQUEST:
${state.prompt}

Return ONLY the code block.`

            const response = await llm.invoke(prompt)
            const content = JSON.parse(response.content)
            const code = content.code
            const explanation = content.explanation
            return {
                ...state,
                aiResponse: `Code : ${code} \n Explanation : ${explanation}`,
                agent: "code",
                artifacts: [
                    {
                        id: Date.now(),
                        type: "Project",
                        files: code.files || []
                    }
                ]
            }
        }


    } catch (error) {
        console.error("codeAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in codeAgent: ${error.message}`
        }
    }
}