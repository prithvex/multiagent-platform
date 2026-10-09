export const imageAnalyser = async (state) => {
    try {
        const { file, prompt, userId, conversationId } = state

    } catch (error) {
        console.error("imageAnalyser error:", error)
        return {
            ...state,
            aiResponse: `Error in imageAnalyser: ${error.message}`
        }
    }
}