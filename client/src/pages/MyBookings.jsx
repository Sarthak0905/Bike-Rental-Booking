import { useEffect, useState } from "react";
import api from "../services/api";
import loadRazorpay from "../utils/loadRazorpay";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      setError("Could not load bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not cancel booking."
      );
    }
  };

  const payForBooking = async (booking) => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        setError("Could not load payment checkout.");
        return;
      }

      const orderResponse = await api.post("/payments/create-order", {
        bookingId: booking._id
      });

      const { order } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Balaghat Bike Rental",
        description: `Booking for ${booking.bike?.name || "bike"}`,
        order_id: order.id,

        handler: async (paymentResponse) => {
          try {
            await api.post("/payments/verify", {
              bookingId: booking._id,
              ...paymentResponse
            });

            await fetchBookings();
          } catch (error) {
            setError(
              error.response?.data?.message ||
              "Payment completed but verification failed."
            );
          }
        },

        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.name || "",
          email: JSON.parse(localStorage.getItem("user"))?.email || ""
        },

        theme: {
          color: "#2563eb"
        }
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.open();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not start payment."
      );
    }
  };

  return (
    <div className="page-card bookings-page">
      <h1>My Bookings</h1>

      {error && <p className="error-message">{error}</p>}

      {(!bookings || bookings.length === 0) && !error && (
        <p className="empty-state">You have no bookings yet.</p>
      )}

      <div className="bookings-list">
        {(bookings || []).map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="booking-card-header">
              <h3>{booking.bike?.name || "Bike removed"}</h3>
              <span className={`status-pill ${booking.status}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-meta">
              <div className="booking-meta-item">
                <span>Pickup</span>
                <strong>{new Date(booking.pickupDate).toLocaleDateString()}</strong>
              </div>
              <div className="booking-meta-item">
                <span>Return</span>
                <strong>{new Date(booking.returnDate).toLocaleDateString()}</strong>
              </div>
              <div className="booking-meta-item">
                <span>Total</span>
                <strong>₹{booking.totalPrice}</strong>
              </div>
              <div className="booking-meta-item">
                <span>Payment</span>
                <strong>{booking.paymentStatus || "unpaid"}</strong>
              </div>
            </div>

            <div className="booking-actions">
              {["pending", "approved"].includes(booking.status) && (
                <button className="secondary-button" onClick={() => cancelBooking(booking._id)}>
                  Cancel booking
                </button>
              )}
              {booking.status === "pending" && booking.paymentStatus !== "paid" && (
                <button className="primary-button" onClick={() => payForBooking(booking)}>
                  Pay ₹{booking.totalPrice}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}