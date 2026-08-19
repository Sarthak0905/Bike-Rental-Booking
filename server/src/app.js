const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { RedisStore } = require("rate-limit-redis");
const swaggerSpec = require("./config/swagger");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");


const path = require("path");

const app = express();
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP if serving static files to avoid breaking React builds easily
}));
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use("/api/health",(req,res)=>{
  console.log("server respond with api");
  res.status(200).send("OK");
})

app.use("/api/auth", authRoutes);

app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend statically in production if they are hosted together
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/dist", "index.html"));
  });
}

app.use(errorHandler);
module.exports = app;