# Bike Rental Booking

A full-stack bike rental booking platform built with React and Node.js. It allows users to browse bikes, make bookings, complete payments, and manage their reservations, while admins can add new bikes to the catalog.

## 🚀 Features

- User registration and login
- Bike listing and detailed bike view
- Booking flow for selected dates
- My bookings dashboard
- Secure payment integration with Razorpay
- Admin support for adding bikes
- API documentation with Swagger

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Redis
- JWT authentication
- Swagger UI
- Nodemailer
- Cloudinary

## 📁 Project Structure

```text
client/              # React frontend
server/              # Express backend
docker-compose.yml   # MongoDB, Redis, backend, and client services
```

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- Node.js (v18 or higher recommended)
- npm
- Docker and Docker Compose (optional, for containerized setup)
- MongoDB and Redis (or use Docker Compose)

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory with values similar to:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bike-rental
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
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

## 🐳 Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:
- MongoDB on port `27017`
- Redis
- Backend on port `5000`
- Frontend on port `5173`

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
