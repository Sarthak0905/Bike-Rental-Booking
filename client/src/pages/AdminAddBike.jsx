import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminAddBike() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "bike",
    pricePerDay: "",
    location: "Balaghat",
    description: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
    const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      images.forEach((image) => {
        payload.append("images", image);
      });

      payload.set("pricePerDay", Number(formData.pricePerDay));

      await api.post("/bikes", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not add bike. Check admin access."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card auth-card">
      <h1>Add Bike</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Bike name
          <input
            name="name"
            placeholder="Bike name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Brand
          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="bike">Bike</option>
            <option value="scooty">Scooty</option>
          </select>
        </label>

        <label>
          Price per day
          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Upload images
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Adding..." : "Add Bike"}
        </button>
      </form>
    </div>
  );
}