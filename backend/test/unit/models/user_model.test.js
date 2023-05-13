import { pool } from "../../../src/utils/db.js";
import User from "../../../src/models/user_model.js";
import bcrypt from "bcrypt";
import Hashids from "hashids";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../../.env" });

const {
  PASSWORD_HASH_TIMES,
  LINE_CLIENT_ID,
  LINE_CLIENT_SECRET,
  WEB_DEPLOY_URI,
} = process.env;

jest.mock("../../../src/utils/db.js", () => ({
  pool: {
    getConnection: jest.fn(),
    query: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("User Model Test", () => {
  //signUp function
  describe("signUp function", () => {
    it("should return a user object when both bcrypt.hash and pool.getConnection are successful", async () => {
      const mockConnection = {
        query: jest.fn(),
        release: jest.fn(),
      };
      const mockHashedPassword = "mockHashedPassword";
      const mockResult = {
        insertId: 1,
      };
      const mockUser = {
        id: mockResult.insertId,
        line_binding_code: "mockCode",
        provider: "native",
        name: "mockName",
        email: "mockEmail",
        password: mockHashedPassword,
        login_at: "mockLoginAt",
        image: "mockImage",
      };
      const mockLineBindingCode = {
        line_binding_code: "mockCode",
      };
      const expectedUser = {
        ...mockUser,
        id: mockResult.insertId,
        line_binding_code: mockLineBindingCode.line_binding_code,
      };

      // Mock bcrypt.hash() to return mockHashedPassword
      jest
        .spyOn(bcrypt, "hash")
        .mockImplementation(async () => mockHashedPassword);

      // Mock pool.getConnection() to return mockConnection
      jest
        .spyOn(pool, "getConnection")
        .mockImplementation(async () => mockConnection);

      // Mock connection.query() to return mockResult
      mockConnection.query.mockImplementation(async () => [mockResult]);

      // Mock Hashids constructor to return mockHashids
      jest
        .spyOn(Hashids.prototype, "encode")
        .mockImplementation(() => mockLineBindingCode.line_binding_code);

      const { user } = await User.signUp(
        mockUser.name,
        mockUser.email,
        mockUser.password
      );
      user.image = mockUser.image;
      user.login_at = mockUser.login_at;
      user.id = mockResult.insertId;
      user.line_binding_code = mockLineBindingCode.line_binding_code;

      expect(pool.getConnection).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockUser.password,
        Number(PASSWORD_HASH_TIMES)
      );
      // 1: START TRANSACTION
      // 2: INSERT INTO users SET ?
      // 3: UPDATE `users` SET ? WHERE id = ?
      // 4: COMMIT
      expect(mockConnection.query).toHaveBeenCalledTimes(4);
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        1,
        "START TRANSACTION"
      );
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        "INSERT INTO users SET ?",
        mockUser
      );
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        3,
        "UPDATE `users` SET ? WHERE id = ?",
        [mockLineBindingCode, mockResult.insertId]
      );
      expect(mockConnection.query).toHaveBeenNthCalledWith(4, "COMMIT");

      expect(user).toEqual(expectedUser);
    });

    it("should throw an error when pool.getConnection() throws an error", async () => {
      const mockError = new Error("mock error message");
      jest.spyOn(pool, "getConnection").mockImplementation(() => {
        throw mockError;
      });

      await expect(
        User.signUp("mockName", "mockEmail", "mockPassword")
      ).rejects.toThrow(mockError);
    });

    it("should throw an error when any query execution fails", async () => {
      const mockConnection = {
        query: jest.fn(),
        release: jest.fn(),
      };
      jest
        .spyOn(pool, "getConnection")
        .mockImplementation(() => mockConnection);
      mockConnection.query.mockRejectedValueOnce(
        new Error("mock query error message")
      );

      const errorObj = {
        error: "Request Error: Email Already Exists",
        status: 403,
      };

      await expect(
        User.signUp("mockName", "mockEmail", "mockPassword")
      ).resolves.toMatchObject(errorObj);
    });
  });
  // nativeSignIn function
  describe("nativeSignIn function", () => {
    let mockConnection;
    let mockQuery;
    let mockRelease;
    let mockCompare;
    const email = "test@example.com";
    const password = "Test123!";

    beforeEach(() => {
      mockQuery = jest.fn();
      mockRelease = jest.fn();
      mockCompare = jest.fn();
      mockConnection = {
        query: mockQuery,
        release: mockRelease,
      };
      pool.getConnection.mockResolvedValue(mockConnection);
      bcrypt.compare.mockResolvedValue(true);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return an error if the account does not exist", async () => {
      mockQuery.mockResolvedValueOnce([[]]);

      const result = await User.nativeSignIn(email, password);

      expect(mockQuery).toHaveBeenCalledTimes(3);
      expect(mockQuery).toHaveBeenCalledWith("START TRANSACTION");
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should update last login time and return the user object", async () => {
      const result = await User.nativeSignIn(email, password);

      expect(mockQuery).toHaveBeenCalledTimes(3);
      expect(mockQuery).toHaveBeenNthCalledWith(1, "START TRANSACTION");
      expect(mockRelease).toHaveBeenCalled();
    });
  });
  // getLineProfile function (fetch user profile from LINE API)
  describe("getLineProfile function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return user information", async () => {
      const code = "testCode";
      const state = "testState";
      const token = "testToken";
      const idToken = "testIdToken";

      const axiosPostMock = jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: {
          access_token: token,
          id_token: idToken,
        },
      });

      const jwtVerifyMock = jest.spyOn(jwt, "verify").mockReturnValueOnce({
        name: "testName",
        email: "testEmail@example.com",
        picture: "testPictureUrl",
        sub: "testLineId",
      });

      const expectedUser = {
        name: "testName",
        email: "testEmail@example.com",
        image: "testPictureUrl",
        line_id: "testLineId",
      };

      const result = await User.getLineProfile(code, state);

      expect(result).toEqual(expectedUser);
      expect(axiosPostMock).toHaveBeenCalledWith(
        "https://api.line.me/oauth2/v2.1/token",
        {
          grant_type: "authorization_code",
          code,
          redirect_uri: `${WEB_DEPLOY_URI}/login`,
          client_id: LINE_CLIENT_ID,
          client_secret: LINE_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      expect(jwtVerifyMock).toHaveBeenCalledWith(idToken, LINE_CLIENT_SECRET);
    });

    it("should throw an error when axios.post throws an error", async () => {
      const code = "testCode";
      const state = "testState";
      const expectedError = "testError";

      const axiosPostMock = jest
        .spyOn(axios, "post")
        .mockRejectedValueOnce(expectedError);

      try {
        await User.getLineProfile(code, state);
      } catch (error) {
        console.log(error); // 顯示實際的錯誤訊息
      }

      await expect(User.getLineProfile(code, state)).rejects.toThrowError(
        new Error("Permissions Error: LINE access code is wrong")
      );

      expect(axiosPostMock).toHaveBeenCalledWith(
        "https://api.line.me/oauth2/v2.1/token",
        {
          grant_type: "authorization_code",
          code,
          redirect_uri: `${WEB_DEPLOY_URI}/login`,
          client_id: LINE_CLIENT_ID,
          client_secret: LINE_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    });
  });

  // getUser function
  describe("getUsers function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return users when requirement.uid exists", async () => {
      const mockUsers = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      pool.query.mockResolvedValueOnce([mockUsers]);

      const requirement = { uid: [1, 2] };
      const actualUsers = await User.getUsers(requirement);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, email, image, line_id FROM users WHERE id IN (?)",
        [requirement.uid]
      );
      expect(actualUsers).toEqual(mockUsers);
    });

    it("should return all users when requirement.uid does not exist", async () => {
      const mockUsers = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      pool.query.mockResolvedValueOnce([mockUsers]);

      const requirement = {};
      const expectedCondition = { sql: "", binding: [] };
      const actualUsers = await User.getUsers(requirement);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, email, image, line_id FROM users ",
        []
      );
      expect(actualUsers).toEqual(mockUsers);
    });
  });

  // getUserGroupsIds function
  describe("getUserGroupsIds function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return group ids for a user", async () => {
      const mockGroups = [{ group_id: 1 }, { group_id: 2 }];
      pool.query.mockResolvedValueOnce([mockGroups]);

      const id = 1;
      const expectedQuery = "SELECT * FROM group_users WHERE user_id = ?";
      const expectedBinding = [id];
      const expectedGroupsIds = [1, 2];
      const actualGroupsIds = await User.getUserGroupsIds(id);

      expect(pool.query).toHaveBeenCalledWith(expectedQuery, expectedBinding);
      expect(actualGroupsIds).toEqual(expectedGroupsIds);
    });
  });

  // getGroupsInformation function
  describe("getGroupsInformation function", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return groups information for groupsIds", async () => {
      const mockGroupsInformation = [{ id: 1 }, { id: 2 }, { id: 3 }];
      pool.query.mockResolvedValueOnce(mockGroupsInformation);

      const groupIds = [1, 2, 3];
      const is_archived = 0;
      const expectedQuery =
        "SELECT * FROM `groups` WHERE id IN (?) AND is_archived = ? ORDER BY creation_date DESC";
      const expectedBinding = [groupIds, is_archived];

      await User.getGroupsInformation(groupIds, is_archived);

      expect(pool.query).toHaveBeenCalledWith(expectedQuery, expectedBinding);
    });
  });

  // updateProfile function
  describe("updateProfile function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update user profile and return modified profile data", async () => {
      const user_id = 1;
      const modifiedUserProfile = {
        name: "Test",
        email: "test@example.com",
        image: "http://example.com/test.jpg",
      };
      const mockReturnValue = {
        data: modifiedUserProfile,
      };
      pool.query.mockResolvedValueOnce(mockReturnValue);

      const expectedQuery = "UPDATE users SET ? WHERE id = ?";
      const expectedBinding = [modifiedUserProfile, user_id];
      const expectedReturnValue = mockReturnValue;
      const actualReturnValue = await User.updateProfile(
        user_id,
        modifiedUserProfile
      );

      expect(pool.query).toHaveBeenCalledWith(expectedQuery, expectedBinding);
      expect(actualReturnValue).toEqual(expectedReturnValue);
    });

    it("should catch error and return error object", async () => {
      const user_id = 2;
      const modifiedUserProfile = {
        name: "Test",
        email: "test@example.com",
        image: "http://example.com/test.jpg",
      };
      const mockError = new Error("Failed to update user profile");
      pool.query.mockRejectedValueOnce(mockError);

      const expectedQuery = "UPDATE users SET ? WHERE id = ?";
      const expectedBinding = [modifiedUserProfile, user_id];
      const expectedReturnValue = { error: mockError };
      const actualReturnValue = await User.updateProfile(
        user_id,
        modifiedUserProfile
      );

      expect(pool.query).toHaveBeenCalledWith(expectedQuery, expectedBinding);
      expect(actualReturnValue).toEqual(expectedReturnValue);
    });
  });

  // bindingLineUser function
  describe("bindingLineUser function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update user's line_id and return user name", async () => {
      const mockLineBindingCode = "mockCode";
      const mockSource = { userId: "5566" };
      const mockQueryResult = { affectedRows: 1 };
      const mockUser = [{ name: "Tester123" }];

      pool.query.mockReturnValueOnce([mockQueryResult]);
      pool.query.mockReturnValueOnce([mockUser]);

      const expectedLineIdData = { line_id: mockSource.userId };
      const expectedUpdateQuery =
        "UPDATE users SET ? WHERE line_binding_code =?";
      const expectedUpdateBinding = [expectedLineIdData, mockLineBindingCode];
      const expectedSelectQuery =
        "SELECT * FROM users WHERE line_binding_code = ?";
      const expectedSelectBinding = [mockLineBindingCode];
      const expectedOutput = {
        result: mockQueryResult.affectedRows,
        name: mockUser[0].name,
      };

      const actualOutput = await User.bindingLineUser(
        mockLineBindingCode,
        mockSource
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expectedUpdateQuery,
        expectedUpdateBinding
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expectedSelectQuery,
        expectedSelectBinding
      );
      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  // getBindingUser function
  describe("getBindingUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return user if user exists", async () => {
      const mockSource = { userId: "123456" };
      const mockUser = { id: 1, name: "Test5566", line_id: "123456" };
      pool.query.mockReturnValueOnce([[mockUser]]);

      const result = await User.getBindingUser(mockSource);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE line_id = ?",
        [mockSource.userId]
      );
      expect(result).toEqual(mockUser);
    });

    it("should return 0 if user does not exist", async () => {
      const mockSource = { userId: "9527" };
      pool.query.mockReturnValueOnce([[]]);

      const result = await User.getBindingUser(mockSource);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE line_id = ?",
        [mockSource.userId]
      );
      expect(result).toEqual({ result: 0 });
    });

    it("should return error if database query throws error", async () => {
      const mockSource = { userId: "123456" };
      const mockError = new Error("Database query error");
      pool.query.mockRejectedValueOnce(mockError);

      const result = await User.getBindingUser(mockSource);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE line_id = ?",
        [mockSource.userId]
      );
      expect(result).toEqual({ error: mockError, result: -1 });
    });
  });
});
