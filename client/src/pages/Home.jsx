import { useEffect, useState } from "react";
import api from "../services/api";
import BikeCard from "../components/BikeCard";
import { Search, MapPin, Filter, ChevronLeft, ChevronRight, Loader2, ShieldCheck, Clock, CreditCard } from "lucide-react";

export default function Home() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBikes = async (requestedPage = page) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/bikes", {
        params: {
          search: search || undefined,
          category: category || undefined,
          location: location || undefined,
          page: requestedPage,
          limit: 6
        }
      });

      setBikes(response.data.bikes);
      setTotalPages(response.data.totalPages);
      setPage(response.data.page);
    } catch (error) {
      setError("Could not load bikes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBikes(1);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-dark-900 rounded-3xl overflow-hidden mt-6 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Motorcycle on road"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 py-20 sm:py-32 sm:px-12 lg:px-20 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Explore Balaghat with <span className="text-primary-500">Premium Rides</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl leading-relaxed">
            From powerful cruisers for highway adventures to nimble scooters for city streets, find the perfect two-wheeler for your journey.
          </p>
          <div className="flex gap-4">
            <button onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-glow hover:-translate-y-1">
              Book Now
            </button>
            <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md transition-all border border-white/10">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-soft flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Bikes</h3>
          <p className="text-slate-500 leading-relaxed">Every vehicle is thoroughly inspected and serviced to ensure your safety and comfort.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-soft flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
            <Clock size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Booking</h3>
          <p className="text-slate-500 leading-relaxed">Skip the line. Book your ride in seconds and hold your reservation immediately.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-soft flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Payments</h3>
          <p className="text-slate-500 leading-relaxed">Integrated with Razorpay for 100% secure, seamless, and lightning-fast transactions.</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section id="search-section" className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 border focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all py-3 px-4 font-medium"
                placeholder="Bike name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <input
                className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 border focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all py-3 px-4 font-medium"
                placeholder="e.g. City Center..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
              <select
                className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 border focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all py-3 px-4 font-medium appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="bike">Motorcycle</option>
                <option value="scooty">Scooter</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
            >
              Search Rides
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      <section>
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Fleet</h2>
            <p className="text-slate-500 mt-1">Select from our top-rated vehicles</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-3">
             <span className="font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-6" />
            <p className="font-medium text-lg">Curating the best rides for you...</p>
          </div>
        ) : (!bikes || bikes.length === 0) && !error ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No rides found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any vehicles matching your criteria. Try tweaking your search filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(bikes || []).map((bike) => (
                <BikeCard key={bike._id} bike={bike} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button
                  className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                    page === 1 
                      ? "border-slate-100 text-slate-300 cursor-not-allowed" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  }`}
                  disabled={page === 1 || loading}
                  onClick={() => fetchBikes(page - 1)}
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="font-semibold text-slate-400">
                  <span className="text-slate-900 text-lg px-2">{page}</span> / {totalPages}
                </span>

                <button
                  className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                    page === totalPages 
                      ? "border-slate-100 text-slate-300 cursor-not-allowed" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  }`}
                  disabled={page === totalPages || loading}
                  onClick={() => fetchBikes(page + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}