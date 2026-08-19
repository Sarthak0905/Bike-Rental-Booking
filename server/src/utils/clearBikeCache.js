const { getRedisClient } = require("../config/redis");

const clearBikeCache = async () => {
  try{
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const keys = [];

    for await (const key of redisClient.scanIterator({
      MATCH: "bikes:*"
    })) {
      keys.push(key);
    }

  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Cleared ${keys.length} bike cache key(s).`);
  }
}catch (error) {
    console.error("Could not clear bike cache:", error.message);
  };
}
module.exports = clearBikeCache;