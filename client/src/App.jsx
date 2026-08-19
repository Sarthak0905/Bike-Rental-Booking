import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { Loader2 } from "lucide-react";

const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./pages/Register"));
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const BikeDetails = React.lazy(() => import("./pages/BikeDetails"));
const AdminAddBike = React.lazy(() => import("./pages/AdminAddBike"));
const MyBookings = React.lazy(() => import("./pages/MyBookings"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// A simple fallback loading component to show while the chunk downloads
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-blue-600">
    <Loader2 className="w-8 h-8 animate-spin mb-4" />
    <p className="text-gray-500 font-medium text-sm">Loading...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
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
                <Route path="admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}