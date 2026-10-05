import express from "express"
import dotenv from "dotenv"
import connctDb from "./config/db.js"
dotenv.config()

const port = process.env.port

const app = express()

app.get("/", (req, res)=>{
    res.json({"message":"Hello from Auth Service"})
})

app.listen(port, ()=>{
    console.log(`Auth Started at port ${port}`)
    connctDb() // calling the connectDb 
})