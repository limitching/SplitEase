import mysql from "mysql2";
import { pool, poolEnd, mongoose } from "../../../src/utils/db.js";

describe("Database Connection Test", () => {
  let connection;

  beforeAll(() => {
    // Mock MySQL connection
    jest.spyOn(mysql, "createPool").mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValue(),
        end: jest.fn().mockResolvedValue(),
      };
    });

    // Mock MongoDB connection
    jest.spyOn(mongoose, "connect").mockImplementation(() => {
      connection.emit("open");
      return Promise.resolve();
    });
  });

  afterAll(async () => {
    // Restore original functions
    jest.restoreAllMocks();
  });

  it("should create MySQL pool successfully", async () => {
    await expect(pool).toBeDefined();
  });

  it("should end MySQL pool successfully", async () => {
    await expect(poolEnd()).resolves.toBeUndefined();
  });

  it("should connect to MongoDB successfully", async () => {
    await new Promise((resolve) => {
      mongoose.connection.once("open", resolve);
    });
    await expect(mongoose.connection.readyState).toBe(1);
  });

  it("should output error message when database error occurs", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mongoose.connection.emit("error", "test error");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "database error",
      "test error"
    );
  });
});
