import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import BikeDetails from "./pages/BikeDetails";
import AdminAddBike from "./pages/AdminAddBike";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MyBookings from "./pages/MyBookings";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="bikes/:id" element={<BikeDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="my-bookings" element={<MyBookings />} />

            <Route element={<AdminRoute />}>
              <Route path="admin/bikes/new" element={<AdminAddBike />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}