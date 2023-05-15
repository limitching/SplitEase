import User from "../../../src/models/user_model.js";
import {
  signUp,
  signIn,
  nativeSignIn,
  getUserGroups,
  getUserProfile,
  updateUserProfile,
} from "../../../src/controllers/user_controller.js";
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

// signUp function
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

  test("should return a token and user object if sign up successfully", async () => {
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

  test("should call next with a forbidden error if there is a signUp error", async () => {
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

  test("should call next with an internal error if user is not found", async () => {
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

  test("should create a JWT token with the correct payload", async () => {
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

// signIn function
describe("signIn function", () => {
  // mock req, res, next
  const req = {
    body: {
      provider: "native",
      email: "test@test.com",
      password: "Test123!",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return access token and user information for valid native sign in", async () => {
    const user = {
      id: 1,
      provider: "native",
      name: "Test User",
      email: "test@test.com",
      image: "test_image.png",
      line_binding_code: "mockLineBindingCode",
      login_at: new Date(),
    };

    const result = { user, status: 200 };
    User.nativeSignIn.mockResolvedValue(result);

    const accessToken = "testAccessToken";
    jwt.sign.mockReturnValue(accessToken);

    await signIn(req, res, next);

    expect(User.nativeSignIn).toHaveBeenCalledWith(
      req.body.email,
      req.body.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: user.id,
        provider: user.provider,
        name: user.name,
        email: user.email,
        image: user.image,
        line_binding_code: user.line_binding_code,
      },
      TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRE }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: accessToken,
      access_expired: TOKEN_EXPIRE,
      login_at: user.login_at,
      user: {
        id: user.id,
        provider: user.provider,
        name: user.name,
        email: user.email,
        image: user.image,
        line_binding_code: user.line_binding_code,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return error message for invalid native sign in", async () => {
    const result = { error: "Invalid email or password", status: 400 };
    User.nativeSignIn.mockResolvedValue(result);

    await signIn(req, res, next);

    expect(User.nativeSignIn).toHaveBeenCalledWith(
      req.body.email,
      req.body.password
    );
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      customizedError.badRequest("Request Error: Invalid email or password")
    );
  });
});

// nativeSignIn function
describe("nativeSignIn", () => {
  test("should call User.nativeSignIn with correct arguments", async () => {
    const email = "test@test.com";
    const password = "Test123!";
    const expectedResponse = {
      id: "1",
      provider: "native",
      name: "Mr. Test",
      email: "test@test.com",
      image: "test_image.png",
      line_binding_code: "mockLineBindingCode",
    };
    User.nativeSignIn.mockResolvedValue(expectedResponse);

    const response = await User.nativeSignIn(email, password);
    expect(User.nativeSignIn).toHaveBeenCalledWith(email, password);
    expect(response).toEqual(expectedResponse);
  });

  test("should log error and return error object when User.nativeSignIn throws an error", async () => {
    const email = "test@test.com";
    const password = "test123";
    const expectedError = new Error("Something went wrong");
    User.nativeSignIn.mockRejectedValue(expectedError);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const response = await nativeSignIn(email, password);

    expect(User.nativeSignIn).toHaveBeenCalledWith(email, password);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(response.error).toEqual(expectedError);

    consoleErrorSpy.mockRestore();
  });
});

// getUserGroups function
describe("getUserGroup function", () => {
  const req = {
    user: {
      id: 1,
      provider: "native",
      email: "test@test.com",
      name: "Mr. Test",
      image: "mockImage.png",
      line_binding_code: "mockLineBindingCode",
    },
    query: { is_archived: 0 },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  test("should return empty array when user does not belong to any group", async () => {
    User.getUserGroupsIds.mockResolvedValue([]);
    await getUserGroups(req, res);
    expect(User.getUserGroupsIds).toHaveBeenCalledWith(req.user.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test("should return groups when user belongs to one or more groups", async () => {
    const groupsIds = [9527, 9528];
    const groupsInformation = [
      {
        id: 9527,
        slug: "mockSlug1",
        owner: 666,
        name: "dummyName1",
        description: "dummyDescription1",
        default_currency: 1,
        minimized_debts: "1",
        photo: "dummyPhoto1",
        invitation_code: "dummyInvitationCode1",
        creation_date: "mockCreationDate1",
        is_archived: "0",
        line_id: "mockLineId1",
      },
      {
        id: 9528,
        slug: "mockSlug2",
        owner: 666,
        name: "dummyName2",
        description: "dummyDescription2",
        default_currency: 1,
        minimized_debts: "1",
        photo: "dummyPhoto2",
        invitation_code: "dummyInvitationCode2",
        creation_date: "mockCreationDate2",
        is_archived: "0",
        line_id: "mockLineId2",
      },
      ,
    ];
    User.getUserGroupsIds.mockResolvedValue(groupsIds);
    User.getGroupsInformation.mockResolvedValue(groupsInformation);

    await getUserGroups(req, res);

    expect(User.getUserGroupsIds).toHaveBeenCalledWith(req.user.id);
    expect(User.getGroupsInformation).toHaveBeenCalledWith(
      groupsIds,
      req.query.is_archived
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(groupsInformation);
  });
});

// getUserProfile function
describe("getUserProfile function", () => {
  const req = {
    user: {
      id: 666,
      provider: "native",
      email: "test@test.com",
      name: "Test User 666",
      image: "mockImage.png",
      line_binding_code: "mockLineBindingCode",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  test("should return user profile", async () => {
    await getUserProfile(req, res);
    const expectedProfile = {
      id: 666,
      provider: "native",
      email: "test@test.com",
      name: "Test User 666",
      image: "mockImage.png",
      line_binding_code: "mockLineBindingCode",
    };
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedProfile);
  });
});

// updateUserProfile function
describe("updateUserProfile function", () => {
  test("should return 200 status code and updated user information when updateProfile succeeds", async () => {
    const user_id = 555;
    const modifiedUserProfile = {
      name: "Tester 555",
      image: "mockImage.png",
    };
    const user = {
      id: user_id,
      provider: "native",
      email: "test@test.com",
      line_binding_code: "mockLineBindingCode",
    };
    const expectedAccessToken = "test_access_token";
    const expectedAccessExpire = TOKEN_EXPIRE;
    User.updateProfile.mockResolvedValue(user);
    jwt.sign.mockReturnValue(expectedAccessToken);

    const req = {
      user: {
        id: user_id,
        provider: "native",
        email: "test@test.com",
        line_binding_code: "mockLineBindingCode",
      },
      body: modifiedUserProfile,
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateUserProfile(req, res, next);

    expect(User.updateProfile).toHaveBeenCalledWith(
      user_id,
      modifiedUserProfile
    );
    expect(jwt.sign).toHaveBeenCalledWith(user, TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRE,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: expectedAccessToken,
      access_expired: expectedAccessExpire,
      user: user,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 status code when updateProfile returns an error", async () => {
    // Arrange
    const user_id = "test_id";
    const modifiedUserProfile = { name: "Test User" };
    const expectedError = new Error("Database error");
    User.updateProfile.mockResolvedValue({ error: expectedError });
    const req = { user: { id: user_id }, body: modifiedUserProfile };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Act
    await updateUserProfile(req, res, next);

    // Assert
    expect(User.updateProfile).toHaveBeenCalledWith(
      user_id,
      modifiedUserProfile
    );

    expect(next).toHaveBeenCalledWith(
      customizedError.internal("Internal Server Error (MySQL)")
    );
  });
});
