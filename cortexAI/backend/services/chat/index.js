import express from "express"
import dotenv from "dotenv"
import connctDb from "./config/db.js"
dotenv.config()

const port = process.env.port

const app = express()
app.use(express.json())

app.get("/", (req, res)=>{
    res.json({"message":"Hello from chat Service"})
})

app.listen(port, ()=>{
    console.log(`chat Started at port ${port}`)
    connctDb() // calling the connectDb 
})