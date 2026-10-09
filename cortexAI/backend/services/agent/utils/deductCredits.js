

export const deductCredits = async (userId, agent) => {
    try {
        const { data } = await axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`,
            { userId, agent },
            {
                withCredentials: true
            }
        )

        return data.message || data
    } catch (error) {
        console.error("deductCredits error:", error.message)
        return error.message || "Failed to deduct credits"
    }
}