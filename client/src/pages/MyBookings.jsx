import { useEffect, useState } from "react";
import api from "../services/api";
import loadRazorpay from "../utils/loadRazorpay";
import { Calendar, CreditCard, XCircle, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle size={14} className="mr-1" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle size={14} className="mr-1" />;
      default:
        return <Clock size={14} className="mr-1" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Calendar size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p>Loading your bookings...</p>
        </div>
      ) : (!bookings || bookings.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
          <p className="text-gray-500">You haven't rented any bikes yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(bookings || []).map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Bike Image Area (Optional if we wanted to add images to bookings, but we might not have it populated) */}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {booking.bike?.name || "Vehicle Removed"}
                    </h3>
                    <p className="text-sm text-gray-500">Booking ID: <span className="font-mono text-xs">{booking._id}</span></p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Pickup Date</p>
                    <p className="font-medium text-gray-900">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Return Date</p>
                    <p className="font-medium text-gray-900">{new Date(booking.returnDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Amount</p>
                    <p className="font-medium text-blue-600">₹{booking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Payment Status</p>
                    <p className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-900 capitalize'}`}>
                      {booking.paymentStatus || "unpaid"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                  {["pending", "approved"].includes(booking.status) && (
                    <button 
                      className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      onClick={() => cancelBooking(booking._id)}
                    >
                      <XCircle size={16} /> Cancel Booking
                    </button>
                  )}
                  {booking.status === "pending" && booking.paymentStatus !== "paid" && (
                    <button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                      onClick={() => payForBooking(booking)}
                    >
                      <CreditCard size={16} /> Pay ₹{booking.totalPrice}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}