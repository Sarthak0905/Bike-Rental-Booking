const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const {
  createBookingValidator
} = require("../validators/bookingValidator");
const {
  createBookingHold,
  releaseBookingHold
} = require("../utils/bookingHold");
const { redisClient } = require("../config/redis");
const router = express.Router();
router.post("/hold", protect, async (req, res, next) => {
  try {
    const { bikeId, pickupDate, returnDate } = req.body || {};

    if (!bikeId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Bike and booking dates are required."
      });
    }

    const hold = await createBookingHold({
      bikeId,
      pickupDate,
      returnDate,
      userId: req.user._id
    });

    if (!hold.created) {
      return res.status(409).json({
        success: false,
        message: "Another customer is currently checking out this bike."
      });
    }

    res.status(201).json({
      success: true,
      message: "Bike held for 10 minutes.",
      holdKey: hold.holdKey
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/hold", protect, async (req, res, next) => {
  try {
    const { holdKey } = req.body || {};

    if (!holdKey) {
      return res.status(400).json({
        success: false,
        message: "Hold key is required."
      });
    }

    const ownerId = await redisClient.get(holdKey);

    if (ownerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot release this hold."
      });
    }

    await releaseBookingHold(holdKey);

    res.status(200).json({
      success: true,
      message: "Booking hold released."
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", protect,createBookingValidator, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelMyBooking);

router.get("/", protect, allowRoles("admin"), getAllBookings);
router.patch(
  "/:id/status",
  protect,
  allowRoles("admin"),
  updateBookingStatus
);

module.exports = router;