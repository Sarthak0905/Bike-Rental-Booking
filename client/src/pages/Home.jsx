import { useEffect, useState } from "react";
import api from "../services/api";
import BikeCard from "../components/BikeCard";

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
      setError("Could not load bikes.");
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
    <div className="page-card">
      <div className="home-header">
        <div>
          <h1>Balaghat Bike Rental</h1>
          <p className="subtitle">Browse available bikes and book the perfect ride for your trip.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="filter-form">
        <label>
          Search
          <input
            placeholder="Bike name or brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label>
          Location
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="bike">Bike</option>
            <option value="scooty">Scooty</option>
          </select>
        </label>

        <button type="submit" className="primary-button">Search</button>
      </form>

      {loading && <p className="info-text">Loading bikes...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && (!bikes || bikes.length === 0) && !error && <p className="empty-state">No bikes found.</p>}

      <div className="bike-grid">
        {(bikes || []).map((bike) => (
          <BikeCard key={bike._id} bike={bike} />
        ))}
      </div>

      <div className="pagination-bar">
        <button
          className="secondary-button"
          disabled={page === 1 || loading}
          onClick={() => fetchBikes(page - 1)}
        >
          Previous
        </button>

        <span className="pagination-label">
          Page {page} of {totalPages}
        </span>

        <button
          className="secondary-button"
          disabled={page === totalPages || loading}
          onClick={() => fetchBikes(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}