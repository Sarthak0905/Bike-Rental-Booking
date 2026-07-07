const { body, validationResult } = require("express-validator");

const validateBooking = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking data.",
      errors: errors.array()
    });
  }

  next();
};

const createBookingValidator = [
  body("bikeId")
    .isMongoId()
    .withMessage("A valid bike ID is required."),
  body("pickupDate")
    .isISO8601()
    .withMessage("Pickup date must be valid."),
  body("returnDate")
    .isISO8601()
    .withMessage("Return date must be valid."),
  validateBooking
];

module.exports = { createBookingValidator };