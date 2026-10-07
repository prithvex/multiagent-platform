import "dotenv/config"
import express from "express"
import connctDb from "./config/db.js"
import router from "./routes/agent.route.js"

const port = process.env.PORT || process.env.port || 8003

const app = express()
app.use(express.json())
app.use("/", router)

app.get("/", (req, res) => {
    res.json({ "message": "Hello from agent Service" })
})

app.listen(port, () => {
    console.log(`Agent Started at port ${port}`)
    connctDb() // calling the connectDb 
})