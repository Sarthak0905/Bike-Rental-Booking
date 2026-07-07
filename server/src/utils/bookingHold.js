const { redisClient } = require("../config/redis");

const createBookingHold = async ({ bikeId, pickupDate, returnDate, userId }) => {
  const holdKey = `booking-hold:${bikeId}:${pickupDate}:${returnDate}`;

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
  await redisClient.del(holdKey);
};

module.exports = {
  createBookingHold,
  releaseBookingHold
};