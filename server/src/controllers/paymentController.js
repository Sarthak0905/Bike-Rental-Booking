const crypto = require("crypto");
const Booking = require("../models/Booking");
const razorpay = require("../config/razorpay");
const asyncHandler = require("express-async-handler");

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body || {};

  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id
  }).populate("bike", "name");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  if (booking.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "This booking is already paid."
    });
  }

  if (!["pending", "approved"].includes(booking.status)) {
    return res.status(400).json({
      success: false,
      message: "This booking cannot be paid."
    });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: "INR",
    receipt: `booking_${booking._id.toString().slice(-20)}`,
    notes: {
      bookingId: booking._id.toString(),
      userId: req.user._id.toString()
    }
  });

  booking.payment = {
    ...booking.payment,
    razorpayOrderId: order.id
  };
  await booking.save();

  res.status(201).json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency
    },
    booking: {
      id: booking._id,
      bikeName: booking.bike.name
    }
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  } = req.body || {};

  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  if (booking.paymentStatus === "paid") {
    return res.status(200).json({
      success: true,
      message: "Payment was already verified.",
      booking
    });
  }

  if (booking.payment?.razorpayOrderId !== razorpay_order_id) {
    return res.status(400).json({
      success: false,
      message: "Payment order does not match this booking."
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${booking.payment.razorpayOrderId}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    booking.paymentStatus = "failed";
    await booking.save();

    return res.status(400).json({
      success: false,
      message: "Payment signature verification failed."
    });
  }

  booking.paymentStatus = "paid";
  booking.status = "approved";
  booking.payment.razorpayPaymentId = razorpay_payment_id;
  booking.payment.razorpaySignature = razorpay_signature;

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Payment verified and booking confirmed.",
    booking
  });
});

module.exports = {
  createPaymentOrder,
  verifyPayment
};