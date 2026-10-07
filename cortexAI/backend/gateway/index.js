import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import dns from "node:dns/promises";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import getCurrentUser from "./controllers/user.cotroller.js";
import { proxywithheader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";
dotenv.config();

// Use Cloudflare and Google DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(morgan("dev")) // now we see all our api's

app.use(cookieParser())

// Proxy /auth requests to the auth service
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxywithheader(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, proxywithheader(process.env.AGENT_SERVICE));

app.get("/api/me", protect, getCurrentUser)

app.get("/", (req, res) => {
  res.json({ message: "Hello from Gateway" });
});

app.listen(port, () => {
  console.log(`Gateway started on port ${port}`);
});
