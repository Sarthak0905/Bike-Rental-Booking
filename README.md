# Bike Rental Booking

A premium, full-stack bike rental booking platform built with React, Tailwind CSS, and Node.js. It allows users to browse bikes, make bookings, complete payments, and manage their reservations, while admins can manage bookings and add new bikes to the catalog via a dedicated dashboard.

## 🚀 Features

- **Premium Industry-Ready UI:** Fully styled using Tailwind CSS (Deep Slate & Emerald theme) with glassmorphic navigation, sticky split-screen booking cards, and physics-based hover animations.
- **Automated Emails:** Integrates robust Nodemailer via **Google OAuth2** for automatic Welcome Emails on registration, Booking Confirmations, and Cancellation notices.
- **User Authentication:** Secure registration and login using JWT.
- **Bike Catalog:** Browse bikes, view details, filter, and search through a highly responsive grid.
- **Booking Flow:** Select dates, hold bookings with Redis, and manage reservations.
- **Secure Payments:** Full payment integration with Razorpay.
- **Admin Dashboard:** A dedicated control panel for admins to view platform statistics, approve/reject pending bookings, and add new bikes.
- **Performance Optimized:** Features React lazy loading (Code Splitting), backend compound database indexing, and async controller handling.
- **API Documentation:** Auto-generated Swagger documentation.

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS & Lucide React
- React Router (with Code Splitting/Lazy Loading)
- Axios

### Backend
- Node.js & Express (with express-async-handler)
- MongoDB with Mongoose (Optimized Indexing)
- Redis (for caching and booking holds)
- JWT Authentication
- Swagger UI
- Nodemailer (Configured with secure Google OAuth2)
- Cloudinary

## 📁 Project Structure

```text
client/              # React frontend (Vite + Tailwind)
server/              # Express backend
docker-compose.yml   # Orchestration for MongoDB, Redis, backend, and client services
```

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- Node.js (v18 or higher recommended)
- npm
- Docker and Docker Compose (optional, for containerized setup)
- MongoDB and Redis (or use Docker Compose)

## 🔐 Environment Variables

Create `.env` files for both the frontend and backend. **Do not commit these files to version control.** Our `docker-compose.yml` is safely configured to dynamically pull variables from these local files to prevent security leaks.

### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bike-rental
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173,https://your-production-url.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_gmail_address
EMAIL_FROM=your_gmail_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sarthak0905/Bike-Rental-Booking.git
cd Bike-Rental-Booking
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Start the backend

```bash
cd ../server
npm run dev
```

The backend will run at `http://localhost:5000`.

### 5. Start the frontend

```bash
cd ../client
npm run dev
```

The frontend will run at `http://localhost:5173`.

## 🐳 Run with Docker Compose (Production Ready)

Our Docker setup is highly secure and production-ready. Hardcoded credentials have been removed from the `.yml` file, so the containers will safely pull secrets directly from your local `server/.env` file instead.

From the project root:

```bash
docker-compose up --build -d
```

This starts:
- MongoDB on port `27017`
- Redis
- Backend API on port `5000`
- Frontend UI on port `5173`

## 📚 API Documentation

Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

## 🧪 Testing

Run the backend test suite with:

```bash
cd server
npm test
```

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request with your improvements.

## 📄 License

This project is open-source and available under the ISC license.
