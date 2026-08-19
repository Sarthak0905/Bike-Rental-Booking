import { useEffect, useState } from "react";
import api from "../services/api";
import BikeCard from "../components/BikeCard";
import { Search, MapPin, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Find your perfect ride</h1>
          <p className="text-blue-100 text-lg mb-8">
            Browse our wide selection of bikes and scooters for your next adventure in Balaghat.
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="Bike name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="e.g. City Center..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="bike">Bike</option>
                <option value="scooty">Scooty</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-xl font-bold text-gray-900">Available Vehicles</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-3">
             <span className="font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p>Finding the best rides for you...</p>
          </div>
        ) : (!bikes || bikes.length === 0) && !error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bikes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(bikes || []).map((bike) => (
                <BikeCard key={bike._id} bike={bike} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                    page === 1 
                      ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={page === 1 || loading}
                  onClick={() => fetchBikes(page - 1)}
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page <span className="text-gray-900">{page}</span> of {totalPages}
                </span>

                <button
                  className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                    page === totalPages 
                      ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
      </div>
    </div>
  );
}