import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import dns from "node:dns/promises";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

// Use Cloudflare and Google DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))

app.use(cookieParser())

// Proxy /auth requests to the auth service
app.use("/auth", proxy(process.env.AUTH_SERVICE));

app.get("/", (req, res) => {
  res.json({ message: "Hello from Gateway" });
});

app.listen(port, () => {
  console.log(`Gateway started on port ${port}`);
});
