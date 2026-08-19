import { Link } from "react-router-dom";
import { MapPin, Tag, ArrowRight } from "lucide-react";

export default function BikeCard({ bike }) {
  const imageUrl = bike.images?.[0]?.url;

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
      <div className="h-56 bg-slate-100 flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} alt={bike.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-slate-400 text-sm font-medium">No image available</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wider">
            {bike.category}
          </div>
        </div>
        
        {/* Availability Badge */}
        {!bike.isAvailable && (
          <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm uppercase tracking-wider">
            Booked
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{bike.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Tag size={14} className="text-slate-400" />
            <span className="font-medium">{bike.brand}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            <span className="line-clamp-1 font-medium">{bike.location}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-2xl font-black text-slate-900">₹{bike.pricePerDay}</span>
            <span className="text-sm font-medium text-slate-500 ml-1">/ day</span>
          </div>
          <Link
            to={`/bikes/${bike._id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white font-bold rounded-xl text-sm transition-all duration-300"
          >
            Book <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}