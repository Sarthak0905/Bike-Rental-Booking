import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, PlusCircle, Bike } from "lucide-react";

export default function Layout() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
      : "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Bike className="text-blue-600" />
              <span>Balaghat Rental</span>
            </NavLink>
            <nav className="flex items-center gap-2">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              {token ? (
                <>
                  <NavLink to="/profile" className={navLinkClass}>
                    <User size={18} />
                    <span className="hidden sm:inline">Profile</span>
                  </NavLink>
                  <NavLink to="/my-bookings" className={navLinkClass}>
                    <Calendar size={18} />
                    <span className="hidden sm:inline">My Bookings</span>
                  </NavLink>
                  {user.role === "admin" && (
                    <>
                      <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <Calendar size={18} />
                        <span className="hidden sm:inline">Admin Dashboard</span>
                      </NavLink>
                      <NavLink to="/admin/bikes/new" className={navLinkClass}>
                        <PlusCircle size={18} />
                        <span className="hidden sm:inline">Add Bike</span>
                      </NavLink>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors ml-2 border border-red-100"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
