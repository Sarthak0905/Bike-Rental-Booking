import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Your session expired. Please login again.");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };

    getProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (error) return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
      <p className="font-medium">{error}</p>
    </div>
  );
  
  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <User size={40} />
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Account Role</p>
                <p className="font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-8 bg-white hover:bg-gray-50 text-red-600 font-medium py-2.5 px-4 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}