import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Bike, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Bike size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your rentals</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 border border-red-100 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all py-2.5 px-3 text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing in...</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          New user? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}