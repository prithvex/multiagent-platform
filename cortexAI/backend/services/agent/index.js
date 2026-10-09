import "dotenv/config"
import express from "express"
import connctDb from "./config/db.js"
import router from "./routes/agent.route.js"

const port = process.env.PORT || process.env.port || 8003

const app = express()
app.use(express.json())
app.use("/", router)

//anywhere error in agent
app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json(err.data)
    }

    return res.status(500).json({ message: `agent error ${error}` })
})

app.get("/", (req, res) => {
    res.json({ "message": "Hello from agent Service" })
})

app.listen(port, () => {
    console.log(`Agent Started at port ${port}`)
    connctDb() // calling the connectDb 
})