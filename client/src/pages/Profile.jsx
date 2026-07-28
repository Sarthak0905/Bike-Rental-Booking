import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  if (error) return <div className="page-card"><p className="error-message">{error}</p></div>;
  if (!user) return <div className="page-card"><p>Loading profile...</p></div>;

  return (
    <div className="page-card profile-card">
      <h1>My Profile</h1>

      <div className="profile-details">
        <div>
          <strong>Name</strong>
          <p>{user.name}</p>
        </div>
        <div>
          <strong>Email</strong>
          <p>{user.email}</p>
        </div>
        <div>
          <strong>Role</strong>
          <p>{user.role}</p>
        </div>
      </div>

      <button className="secondary-button" onClick={logout}>Logout</button>
    </div>
  );
}