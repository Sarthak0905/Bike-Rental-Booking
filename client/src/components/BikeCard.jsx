import { Link } from "react-router-dom";

export default function BikeCard({ bike }) {
  const imageUrl = bike.images?.[0]?.url;
  return (
    <div>
       {imageUrl ? (
        <img
          src={imageUrl}
          alt={bike.name}
          width="220"
          height="150"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div>No image available</div>
      )}
      <h3>{bike.name}</h3>
      <p>Brand: {bike.brand}</p>
      <p>Category: {bike.category}</p>
      <p>Location: {bike.location}</p>
      <p>₹{bike.pricePerDay} / day</p>

      <Link to={`/bikes/${bike._id}`}>View Details</Link>
    </div>
  );
}