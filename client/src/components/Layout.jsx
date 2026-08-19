import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, PlusCircle, Bike, Shield, LayoutDashboard, MapPin, Mail, Phone } from "lucide-react";

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
      ? "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-primary-50 text-primary-600 transition-all duration-200"
      : "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-primary-500 rounded-xl group-hover:bg-primary-600 transition-colors shadow-glow">
                <Bike className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Balaghat <span className="text-primary-500">Rentals</span>
              </span>
            </NavLink>

            {/* Navigation */}
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
                    <span className="hidden sm:inline">Bookings</span>
                  </NavLink>
                  
                  {user.role === "admin" && (
                    <div className="hidden lg:flex items-center gap-2 pl-4 ml-2 border-l border-slate-200">
                      <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </NavLink>
                      <NavLink to="/admin/bikes/new" className={navLinkClass}>
                        <PlusCircle size={18} />
                        <span>Add Bike</span>
                      </NavLink>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all ml-2"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <NavLink to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                    Log in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-dark-900 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <NavLink to="/" className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-500/20 rounded-xl">
                  <Bike className="text-primary-500 w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Balaghat Rentals
                </span>
              </NavLink>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                Experience the thrill of the ride. We offer the best two-wheelers in town with instant booking, competitive pricing, and top-notch customer support.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors font-medium">Facebook</a>
                <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors font-medium">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors font-medium">Instagram</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-4">
                <li><NavLink to="/" className="text-slate-400 hover:text-primary-400 transition-colors">Home</NavLink></li>
                <li><NavLink to="/bikes" className="text-slate-400 hover:text-primary-400 transition-colors">Browse Bikes</NavLink></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPin size={18} className="text-primary-500 shrink-0" />
                  <span>123 Main Street, Balaghat, MP</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone size={18} className="text-primary-500 shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail size={18} className="text-primary-500 shrink-0" />
                  <span>support@balaghatrentals.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Balaghat Rentals. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Shield size={16} className="text-primary-500" /> Secure Booking System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
