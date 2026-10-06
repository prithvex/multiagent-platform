import mongoose from "mongoose"

const connctDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db connected ")
    }
    catch(error){
        console.log(`db error ${error}`)
    }
}

export default connctDb // export this function for further use
