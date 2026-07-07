import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  if (error) return <p>{error}</p>;
  if (!bike) return <p>Loading bike...</p>;
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
  return (
    <div>
      <Link to="/">← Back to bikes</Link>

      <h1>{bike.name}</h1>
      <p>Brand: {bike.brand}</p>
      <p>Category: {bike.category}</p>
      <p>Location: {bike.location}</p>
      <p>₹{bike.pricePerDay} per day</p>
      <p>{bike.description}</p>
      <div>
  {bike.images?.map((image) => (
    <img
      key={image.publicId}
      src={image.url}
      alt={bike.name}
      width="250"
      height="180"
      style={{ objectFit: "cover", marginRight: "10px" }}
    />
  ))}

</div>
<form onSubmit={handleBooking}>
  <h2>Book this bike</h2>

  <label>
    Pickup date
    <input
      type="date"
      value={pickupDate}
      onChange={(e) => setPickupDate(e.target.value)}
      required
    />
  </label>

  <label>
    Return date
    <input
      type="date"
      value={returnDate}
      onChange={(e) => setReturnDate(e.target.value)}
      required
    />
  </label>

  <button type="submit" disabled={bookingLoading}>
    {bookingLoading ? "Creating booking..." : "Request booking"}
  </button>

  {bookingMessage && <p>{bookingMessage}</p>}
</form>
      <button>Book this bike</button>
    </div>
    
  );
}