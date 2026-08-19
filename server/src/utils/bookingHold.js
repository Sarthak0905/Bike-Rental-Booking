const { getRedisClient } = require("../config/redis");

const createBookingHold = async ({ bikeId, pickupDate, returnDate, userId }) => {
  const holdKey = `booking-hold:${bikeId}:${pickupDate}:${returnDate}`;
  const redisClient = getRedisClient();
  
  if (!redisClient) {
    return { created: true, holdKey }; // Bypass hold if Redis is disabled
  }

  const result = await redisClient.set(
    holdKey,
    userId.toString(),
    {
      NX: true,
      EX: 10 * 60
    }
  );

  return {
    created: result === "OK",
    holdKey
  };
};

const releaseBookingHold = async (holdKey) => {
  const redisClient = getRedisClient();
  if (redisClient) {
    await redisClient.del(holdKey);
  }
};

module.exports = {
  createBookingHold,
  releaseBookingHold
};