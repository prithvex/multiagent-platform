import express from "express"
import dotenv from "dotenv"
dotenv.config()

const port = process.env.port

const app = express()

app.get("/", (req, res)=>{
    res.json({"message":"Hello from GateWay"})
})

app.listen(port, ()=>{
    console.log(`GateWay Started at port ${8000}`)
})