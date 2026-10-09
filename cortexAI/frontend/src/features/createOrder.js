import api from "../../utils/axios"

export const createOrder = async (plan) => {
    try {
        const { data } = await api.post("/api/billing/create", { plan })
        return data.message || data
    } catch (error) {
        console.error("createOrder error:", error)
        return []
    }
}