const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("Redis Cloud Connected Successfully 🚀🔴");
});

redis.on("ready", () => {
  console.log("Redis is Ready 🟢");
});

redis.on("error", (err) => {
  console.log("Redis Error ❌:", err.message);
});

redis.on("close", () => {
  console.log("Redis Connection Closed ⚠️");
});

module.exports = redis;