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

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Balaghat Rentals!",
    text: `Hi ${user.name}, welcome to Balaghat Rentals! We are thrilled to have you on board. Start exploring our premium fleet of two-wheelers today.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px; border-radius: 12px;">
        <h2 style="color: #0f172a;">Welcome to Balaghat Rentals, ${user.name}! 🏍️</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">We are thrilled to have you on board. Start exploring our premium fleet of two-wheelers today.</p>
        <a href="https://bike-rental-booking.vercel.app/" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Book a Ride Now</a>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendBookingCreatedEmail,
  sendBookingCancelledEmail,
  sendWelcomeEmail
};