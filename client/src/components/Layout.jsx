import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand">
          Balaghat Bike Rental
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Home</NavLink>
          {token ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Profile</NavLink>
              <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>My Bookings</NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin/bikes/new" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Add bike</NavLink>
              )}
              <button type="button" className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
