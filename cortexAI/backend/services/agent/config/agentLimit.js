import redis from "../../../shared/redis/redis";

//this limit per min.
const Limits = {
    chat: 20,
    coding: 5,
    pdf: 5,
    ppt: 5,
    image: 3,
    search: 5
}

export const checkAgentLimit = async (userId, agent) => {
    const max = Limits[agent] || Limits["chat"];

    //we store the key into the redis, with userId and their agent name
    const key = `rate: ${userId}:${agent}`;

    const count = await redis.incr(key);

    //we set the expiry time of the key to 60 second means 1 minute
    if (count == 1) {
        await redis.expire(key, 60);
    }

    //time to leave --> when refresh key
    const ttl = await redis.ttl(key)

    if (count > max) {
        const minute = Math.floor(ttl / 60)
        const second = ttl % 60

        const time = minute > 0 ? `${minute} min ${second} sec ` : `${second} sec`

        const error = new Error(`Rate limit exceeded for ${agent}`);
        error.status = 429
        error.data = {
            success: false,
            agent,
            limit: max,
            remainingTime: ttl,
            retryAfter: time,
            message: `You have reached the ${agent} limit (${max}) requests/minute). Try again in ${time}).`

        }
        throw error
    }

    return {
        remaining: max - count,
        limit: max,
        retryAfter: ttl,
        success: true
    }
}
