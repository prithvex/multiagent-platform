import api from "../../utils/axios"

const logOut = async () => {
    try {
        const { data } = await api.get("/api/auth/logout")
        return data

    } catch (error) {
        console.log(error)
        return null
    }
}

export { logOut } 