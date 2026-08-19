import { Link } from "react-router-dom";
import { MapPin, Tag } from "lucide-react";

export default function BikeCard({ bike }) {
  const imageUrl = bike.images?.[0]?.url;

  return (
    <article className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} alt={bike.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm">No image available</div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {bike.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{bike.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Tag size={14} />
            <span>{bike.brand}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{bike.location}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-blue-600">₹{bike.pricePerDay}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <Link
            to={`/bikes/${bike._id}`}
            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg text-sm transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}