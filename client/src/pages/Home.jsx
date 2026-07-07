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
    <div>
      <h1>Balaghat Bike Rental</h1>

      <form onSubmit={handleSearch}>
        <input
          placeholder="Search bike or brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="bike">Bike</option>
          <option value="scooty">Scooty</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading bikes...</p>}
      {error && <p>{error}</p>}

      {!loading && bikes.length === 0 && <p>No bikes found.</p>}

      <div>
        {bikes.map((bike) => (
          <BikeCard key={bike._id} bike={bike} />
        ))}
      </div>

      <div>
        <button
          disabled={page === 1 || loading}
          onClick={() => fetchBikes(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => fetchBikes(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}