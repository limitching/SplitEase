import User from "../../../src/models/user_model.js";
import { signUp } from "../../../src/controllers/user_controller.js";
import jwt from "jsonwebtoken";
import { customizedError } from "../../../src/utils/error.js";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../../.env" });
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env;

// mock user_model.js
jest.mock("../../../src/models/user_model.js");

// mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// sign up function
describe("signUp function", () => {
  const req = {
    body: {
      name: "testName",
      email: "testEmail",
      password: "testPassword",
    },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  it("should return a token and user object if sign up successfully", async () => {
    const mockUser = {
      id: "testId",
      provider: "testProvider",
      name: "testName",
      email: "testEmail",
      image: "testImage",
      line_binding_code: "testLineBindingCode",
      login_at: "testLoginAt",
    };
    User.signUp.mockResolvedValueOnce({ user: mockUser });
    jwt.sign.mockReturnValueOnce("testToken");

    await signUp(req, res, next);

    expect(User.signUp).toHaveBeenCalledWith(
      req.body.name,
      req.body.email,
      req.body.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        provider: mockUser.provider,
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        line_binding_code: mockUser.line_binding_code,
      },
      TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRE }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: "testToken",
      access_expired: TOKEN_EXPIRE,
      login_at: mockUser.login_at,
      user: {
        id: mockUser.id,
        provider: mockUser.provider,
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        line_binding_code: mockUser.line_binding_code,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with a forbidden error if there is a signUp error", async () => {
    const errorMessage = "Invalid email";
    User.signUp.mockResolvedValueOnce({ error: errorMessage });

    await signUp(req, res, next);

    expect(User.signUp).toHaveBeenCalledWith(
      req.body.name,
      req.body.email,
      req.body.password
    );
    expect(next).toHaveBeenCalledWith(customizedError.forbidden(errorMessage));
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it("should call next with an internal error if user is not found", async () => {
    User.signUp.mockResolvedValueOnce({ user: null });

    await signUp(req, res, next);

    expect(User.signUp).toHaveBeenCalledWith(
      req.body.name,
      req.body.email,
      req.body.password
    );
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      customizedError.internal("Server Error: Database Query Error")
    );
  });

  it("should create a JWT token with the correct payload", async () => {
    const mockUser = {
      id: "testId",
      provider: "testProvider",
      name: "testName",
      email: "testEmail",
      image: "testImage",
      line_binding_code: "testLineBindingCode",
    };
    User.signUp.mockResolvedValueOnce({ user: mockUser });
    jwt.sign.mockReturnValueOnce("testToken");

    await signUp(req, res, next);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        provider: mockUser.provider,
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        line_binding_code: mockUser.line_binding_code,
      },
      TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRE }
    );
    expect(jwt.sign).toHaveReturnedWith("testToken");
  });
});
