const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("registers a user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "Password@123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe("test@example.com");
    expect(response.body.user.password).toBeUndefined();
  });

  it("does not allow duplicate email registration", async () => {
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: "hashed_password"
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "existing@example.com",
        password: "Password@123"
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("rejects invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "not-an-email",
        password: "Password@123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });
});