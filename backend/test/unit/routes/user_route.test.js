import request from "supertest";
import express from "express";
import { signUp, signIn } from "../../../src/controllers/user_controller.js";

import userRouter from "../../../src/routes/user_route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/1.0", userRouter);

jest.mock("../../../src/controllers/user_controller.js", () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  getUserGroups: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
}));

jest.mock("../../../src/utils/util.js", () => ({
  wrapAsync: (fn) => {
    return function (req, res, next) {
      fn(req, res, next).catch(next);
    };
  },
  authentication: (req, res, next) =>
    function (req, res, next) {
      return next();
    },
}));

// user/signup route
describe("POST /user/signup", () => {
  test("should call signUp function", async () => {
    const user = {
      name: "Test User",
      email: "test1@test.splitease.com",
      password: "Test123!",
    };

    await request(app).post("/api/1.0/user/signup").send(user);
    expect(signUp).toHaveBeenCalled();
  });
});
// user/signin route
describe("POST /user/signin", () => {
  test("should call signIn function", async () => {
    const user = {
      provider: "native",
      email: "test@test.splitease.com",
      password: "Test123!",
    };

    await request(app).post("/api/1.0/user/signin").send(user);
    expect(signIn).toHaveBeenCalled();
  });
});
