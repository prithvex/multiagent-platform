import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL ? (process.env.REDIS_URL.startsWith("//") ? `redis:${process.env.REDIS_URL}` : process.env.REDIS_URL) : "redis://localhost:6379"

const redis = new Redis(redisUrl)

// creating event 
redis.on("connect", () => {
    console.log("redis connected!")
})
redis.on("error", (err) => {
    console.error("Redis connection error:", err.message)
})

export default redis