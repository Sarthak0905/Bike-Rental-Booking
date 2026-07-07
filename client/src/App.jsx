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
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
           <Route element={<AdminRoute />}>
            <Route path="/admin/bikes/new" element={<AdminAddBike />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}