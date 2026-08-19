import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, MapPin, Tag, Calendar as CalendarIcon, Info, Image as ImageIcon, CheckCircle, Shield } from "lucide-react";

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
    <div className="max-w-2xl mx-auto mt-12 bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center gap-4 text-center">
      <Info size={40} className="text-red-500" />
      <span className="font-bold text-xl">{error}</span>
      <Link to="/" className="mt-4 px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-semibold transition-colors shadow-md">Go back home</Link>
    </div>
  );
  
  if (!bike) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 animate-pulse">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
      <p className="font-medium text-lg">Loading premium details...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to fleet
      </Link>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          
          {/* Images Section */}
          <div className="lg:col-span-3 bg-slate-50 p-6 lg:p-10 lg:border-r border-slate-100">
            {bike.images?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-sm aspect-[4/3] bg-slate-200 group relative">
                  <img
                    src={bike.images[0].url}
                    alt={bike.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-slate-900 shadow-sm uppercase tracking-widest">
                    {bike.category}
                  </div>
                </div>
                {bike.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {bike.images.slice(1).map((image) => (
                      <div key={image.publicId || image.url} className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-200 opacity-70 hover:opacity-100 hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-primary-500">
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
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-2xl">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <span className="font-medium text-lg">No imagery available</span>
              </div>
            )}
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Overview</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {bike.description || "Experience the thrill of the ride with this premium vehicle."}
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <CheckCircle className="text-primary-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900">Fully Serviced</h4>
                    <p className="text-sm text-slate-500 mt-1">Inspected before every rental</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <Shield className="text-primary-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900">Insured Ride</h4>
                    <p className="text-sm text-slate-500 mt-1">Basic insurance included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Booking Section (Sticky) */}
          <div className="lg:col-span-2 p-6 lg:p-10 flex flex-col relative">
            <div className="sticky top-28">
              <div className="mb-8 pb-8 border-b border-slate-100">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">{bike.name}</h1>
                
                <div className="flex flex-wrap gap-4 text-slate-600 text-sm mb-6">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Tag size={16} className="text-slate-500" />
                    <span className="font-semibold text-slate-800">{bike.brand}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <MapPin size={16} className="text-slate-500" />
                    <span className="font-semibold text-slate-800">{bike.location}</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-100 inline-flex flex-col">
                  <span className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-1">Rental Price</span>
                  <div>
                    <span className="text-4xl font-black text-primary-600">₹{bike.pricePerDay}</span>
                    <span className="text-primary-700 font-bold ml-1">/ day</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBooking} className="flex flex-col gap-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon size={24} className="text-primary-500" /> Reserve this ride
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 border focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all py-3 px-4 font-medium text-slate-800"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 border focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all py-3 px-4 font-medium text-slate-800"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingLoading || !bike.isAvailable} 
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {bookingLoading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing Securely...</>
                  ) : !bike.isAvailable ? (
                    "Currently Unavailable"
                  ) : (
                    "Request Booking"
                  )}
                </button>

                {bookingMessage && (
                  <div className={`p-4 rounded-xl text-sm font-bold border ${
                    bookingMessage.includes("Error") || bookingMessage.includes("Could not") 
                      ? "bg-red-50 text-red-700 border-red-100" 
                      : "bg-primary-50 text-primary-700 border-primary-100"
                  }`}>
                    {bookingMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}