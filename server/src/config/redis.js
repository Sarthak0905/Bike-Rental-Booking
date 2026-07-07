const { createClient } = require("redis");

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log("REDIS_URL is not set. Redis disabled.");
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: false
    }
  });

  redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
  });

  try {
    await redisClient.connect();
    console.log("Redis connected");
    return redisClient;
  } catch (error) {
    console.error("Redis unavailable. Continuing without Redis:", error.message);

    if (redisClient?.isOpen) {
      await redisClient.quit();
    }

    redisClient = null;
    return null;
  }
};

const getRedisClient = () => {
  return redisClient?.isOpen ? redisClient : null;
};

module.exports = {
  connectRedis,
  getRedisClient
};