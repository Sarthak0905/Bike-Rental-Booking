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
      await api.post("/bikes", {
        ...formData,
        pricePerDay: Number(formData.pricePerDay)
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
    <div>
      <h1>Add Bike</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Bike name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br />

        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
        />

        <br />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="bike">Bike</option>
          <option value="scooty">Scooty</option>
        </select>

        <br />

        <input
          type="number"
          name="pricePerDay"
          placeholder="Price per day"
          value={formData.pricePerDay}
          onChange={handleChange}
          required
        />

        <br />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <br />
         <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleImageChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Bike"}
        </button>
      </form>
    </div>
  );
}