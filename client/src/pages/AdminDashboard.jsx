import { useEffect, useState } from "react";
import api from "../services/api";
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/admin/dashboard")
      ]);
      setBookings(bookingsRes.data.bookings || []);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError("Could not load dashboard data. Are you an admin?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Calendar size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bikes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBikes}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Bookings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue}</p>
              </div>
            </div>
          )}

          {/* Bookings Table */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500">No bookings found in the system.</p>
            </div>
          ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-mono">{booking._id.substring(0, 6)}...</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.user?.name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">{booking.user?.email || ""}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.bike?.name || "Removed"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.pickupDate).toLocaleDateString()} - <br/>
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {booking.paymentStatus || 'unpaid'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(booking._id, 'approved')}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-md"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </>
      )}
    </div>
  );
}
