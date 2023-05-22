/* eslint-disable no-undef */
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models/user");

require("dotenv").config();

// відповідь повина мати статус-код 200
// res.status = 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_HOST);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("test login-controller function", () => {
  it("should return res.status(200)", async () => {
    const res = await request(app).post("/api/auth/login").send({
			email: "test@bbbka.net",
			password: "111111",
		});

    expect(res.statusCode).toBe(200);
  });

  it("should return  res.token", async () => {
    const res = await request(app).post("/api/auth/login").send({
			email: "test@bbbka.net",
			password: "111111",
		});
    const { email } = res.body.user;
    const user = await User.findOne({ email });

    expect(res.body.token).toBe(user.token);
  });

  it("should return   res.user", async () => {
    const res = await request(app).post("/api/auth/login").send({
			email: "test@bbbka.net",
			password: "111111",
		});

    expect(res.body.user).toStrictEqual({
			email: "test@bbbka.net",
			subscription: "starter",
		});
  });
});