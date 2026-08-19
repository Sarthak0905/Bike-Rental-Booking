import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, MapPin, Tag, Calendar as CalendarIcon, Info, Image as ImageIcon } from "lucide-react";

export default function BikeDetails() {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const { id } = useParams();

  const [bike, setBike] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getBike = async () => {
      try {
        const response = await api.get(`/bikes/${id}`);
        setBike(response.data.bike);
      } catch (error) {
        setError("Bike not found.");
      }
    };

    getBike();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setBookingMessage("");

    try {
      const response = await api.post("/bookings", {
        bikeId: bike._id,
        pickupDate,
        returnDate
      });

      setBookingMessage(
        `Booking request created. Total: ₹${response.data.booking.totalPrice}`
      );
    } catch (error) {
      setBookingMessage(
        error.response?.data?.message || "Could not create booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (error) return (
    <div className="max-w-2xl mx-auto mt-12 bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex flex-col items-center gap-4">
      <Info size={32} />
      <span className="font-medium text-lg">{error}</span>
      <Link to="/" className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors">Go back home</Link>
    </div>
  );
  
  if (!bike) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-pulse">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p>Loading bike details...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to bikes
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
          
          {/* Images Section */}
          <div className="lg:col-span-3 bg-gray-50 p-6 lg:p-8 lg:border-r border-gray-100">
            {bike.images?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl overflow-hidden shadow-sm aspect-video bg-gray-200">
                  <img
                    src={bike.images[0].url}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {bike.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {bike.images.slice(1).map((image) => (
                      <div key={image.publicId || image.url} className="rounded-xl overflow-hidden aspect-video bg-gray-200 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                        <img
                          src={image.url}
                          alt={bike.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <span>No images available</span>
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this vehicle</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {bike.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Details & Booking Section */}
          <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{bike.name}</h1>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {bike.category}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 mt-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <span><span className="font-medium text-gray-900">Brand:</span> {bike.brand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span><span className="font-medium text-gray-900">Location:</span> {bike.location}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl inline-block">
                <span className="text-3xl font-bold text-blue-700">₹{bike.pricePerDay}</span>
                <span className="text-blue-600 font-medium"> / day</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="flex flex-col gap-5 mt-auto">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon size={20} className="text-blue-600" /> Book this ride
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={bookingLoading} 
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                ) : (
                  "Request Booking"
                )}
              </button>

              {bookingMessage && (
                <div className={`p-4 rounded-lg mt-2 text-sm font-medium border ${
                  bookingMessage.includes("Error") || bookingMessage.includes("Could not") 
                    ? "bg-red-50 text-red-700 border-red-100" 
                    : "bg-green-50 text-green-700 border-green-100"
                }`}>
                  {bookingMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}