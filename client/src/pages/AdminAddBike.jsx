import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PlusCircle, Upload, Image as ImageIcon, Bike, AlertCircle } from "lucide-react";

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
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Bike size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-500 text-sm mt-1">List a new bike or scooter for rental</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Name</label>
              <input
                name="name"
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="e.g. Honda Activa 6G"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
              <input
                name="brand"
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="e.g. Honda"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                name="category"
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm appearance-none"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="bike">Bike</option>
                <option value="scooty">Scooty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price per day (₹)</label>
              <input
                type="number"
                name="pricePerDay"
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="e.g. 500"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                name="location"
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="e.g. Balaghat City"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-3 px-3 text-sm resize-y"
                placeholder="Provide details about the vehicle..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG or WEBP (max 5MB)</p>
                
                {images.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                    <ImageIcon size={16} />
                    <span>{images.length} file(s) selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Adding...</>
              ) : (
                <><PlusCircle size={18} /> Add Vehicle</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}