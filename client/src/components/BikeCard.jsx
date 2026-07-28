import { Link } from "react-router-dom";

export default function BikeCard({ bike }) {
  const imageUrl = bike.images?.[0]?.url;

  return (
    <article className="bike-card">
      <div className="bike-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={bike.name} />
        ) : (
          <div className="empty-state">No image available</div>
        )}
      </div>

      <div className="bike-card-body">
        <h3>{bike.name}</h3>
        <p className="bike-card-meta">Brand: {bike.brand}</p>
        <p className="bike-card-meta">Location: {bike.location}</p>
        <p className="bike-card-meta">₹{bike.pricePerDay}/day</p>
        <Link to={`/bikes/${bike._id}`} className="button-link">
          View details
        </Link>
      </div>
    </article>
  );
}