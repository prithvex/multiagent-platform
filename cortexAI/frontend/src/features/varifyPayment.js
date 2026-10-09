import api from "../../utils/axios"

export const varifiyPayment = async (payload) => {
    try {
        const { data } = await api.post("/api/billing/verify", payload)
        return data.message || data
    } catch (error) {
        console.error("varifiyPayment error:", error)
        return []
    }
}