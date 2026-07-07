const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");

const User = require("../src/models/User");
const Bike = require("../src/models/Bike");
const Booking = require("../src/models/Booking");

let customerToken;
let bikeId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.create({
    name: "Customer",
    email: "customer@example.com",
    password: "Password@123"
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "customer@example.com",
      password: "Password@123"
    });

  customerToken = loginResponse.body.token;

  const bike = await Bike.create({
    name: "Test Bike",
    brand: "Test Brand",
    category: "bike",
    pricePerDay: 1000,
    location: "Balaghat"
  });

  bikeId = bike._id.toString();
});

beforeEach(async () => {
  await Booking.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Booking API", () => {
  it("creates a booking", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        bikeId,
        pickupDate: "2026-08-10",
        returnDate: "2026-08-13"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.booking.totalDays).toBe(3);
    expect(response.body.booking.totalPrice).toBe(3000);
    expect(response.body.booking.status).toBe("pending");
  });

  it("prevents overlapping bookings", async () => {
    await Booking.create({
      user: (await User.findOne({ email: "customer@example.com" }))._id,
      bike: bikeId,
      pickupDate: new Date("2026-08-10"),
      returnDate: new Date("2026-08-13"),
      totalDays: 3,
      totalPrice: 3000,
      status: "pending"
    });

    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        bikeId,
        pickupDate: "2026-08-12",
        returnDate: "2026-08-15"
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("rejects booking without token", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({
        bikeId,
        pickupDate: "2026-08-20",
        returnDate: "2026-08-22"
      });

    expect(response.statusCode).toBe(401);
  });
});