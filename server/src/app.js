const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { RedisStore } = require("rate-limit-redis");
const { redisClient } = require("./config/redis");
const swaggerSpec = require("./config/swagger");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");


// const createRedisRateLimitStore = (prefix) => {
//   return new RedisStore({
//     prefix,
//     sendCommand: (...args) => redisClient.sendCommand(args)
//   });
// };
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 200,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
//   store: createRedisRateLimitStore("rl:general:"),
//   message: {
//     success: false,
//     message: "Too many requests. Please try again later."
//   }
// });

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use("/api/health",(req,res)=>{
  console.log("server respond with api")
})

app.use("/api/auth", authRoutes);

app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);
module.exports = app;