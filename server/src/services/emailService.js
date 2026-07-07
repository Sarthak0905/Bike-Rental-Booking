const transporter = require("../config/email");

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  });
};

const sendBookingCreatedEmail = async ({ user, booking, bike }) => {
  return sendEmail({
    to: user.email,
    subject: "Booking request received",
    text: `Hi ${user.name}, your booking request for ${bike.name} has been received. Total amount: ₹${booking.totalPrice}. Status: pending.`,
    html: `
      <h2>Booking request received</h2>
      <p>Hi ${user.name},</p>
      <p>Your request for <strong>${bike.name}</strong> has been received.</p>
      <p>Pickup: ${booking.pickupDate.toDateString()}</p>
      <p>Return: ${booking.returnDate.toDateString()}</p>
      <p>Total: <strong>₹${booking.totalPrice}</strong></p>
      <p>Status: <strong>Pending</strong></p>
    `
  });
};

const sendBookingCancelledEmail = async ({ user, booking, bike }) => {
  return sendEmail({
    to: user.email,
    subject: "Booking cancelled",
    text: `Hi ${user.name}, your booking for ${bike.name} has been cancelled.`,
    html: `
      <h2>Booking cancelled</h2>
      <p>Hi ${user.name},</p>
      <p>Your booking for <strong>${bike.name}</strong> has been cancelled.</p>
    `
  });
};

module.exports = {
  sendEmail,
  sendBookingCreatedEmail,
  sendBookingCancelledEmail
};