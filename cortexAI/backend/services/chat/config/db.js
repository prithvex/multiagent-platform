import mongoose from "mongoose"
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connctDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db connected ")
    }
    catch (error) {
        console.log(`db error ${error}`)
    }
}

export default connctDb // export this function for further use
