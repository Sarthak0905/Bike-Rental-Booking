const Booking = require("../models/Booking");
const Bike = require("../models/Bike");
const {
  sendBookingCreatedEmail,
  sendBookingCancelledEmail,
} = require("../services/emailService");
const createBooking = async (req, res, next) => {
  try {
    const { bikeId, pickupDate, returnDate } = req.body;

    if (!bikeId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Bike, pickup date, and return date are required.",
      });
    }

    const pickup = new Date(pickupDate);
    const returnDateValue = new Date(returnDate);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returnDateValue.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates.",
      });
    }

    if (pickup >= returnDateValue) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date.",
      });
    }

    if (pickup < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: "Pickup date cannot be in the past.",
      });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike || !bike.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Bike is not available.",
      });
    }

    // Two date ranges overlap when:
    // existing pickup < new return AND existing return > new pickup
    const overlappingBooking = await Booking.findOne({
      bike: bikeId,
      status: { $in: ["pending", "approved"] },
      pickupDate: { $lt: returnDateValue },
      returnDate: { $gt: pickup },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "This bike is already booked for the selected dates.",
      });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil(
      (returnDateValue - pickup) / millisecondsPerDay,
    );

    const booking = await Booking.create({
      user: req.user._id,
      bike: bikeId,
      pickupDate: pickup,
      returnDate: returnDateValue,
      totalDays,
      totalPrice: totalDays * bike.pricePerDay,
    });
    try {
      await sendBookingCreatedEmail({
        user: req.user,
        booking,
        bike,
      });
    } catch (emailError) {
      console.error("Booking created, but email failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("bike", "name brand pricePerDay images location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("bike", "name");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    await booking.save();
    try {
      await sendBookingCancelledEmail({
        user: req.user,
        booking,
        bike: booking.bike,
      });
    } catch (emailError) {
      console.error("Booking cancelled, but email failed:", emailError.message);
    }
    res.status(200).json({
      success: true,
      message: "Booking cancelled.",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("bike", "name brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "pending" && status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved or rejected.",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  updateBookingStatus,
};
