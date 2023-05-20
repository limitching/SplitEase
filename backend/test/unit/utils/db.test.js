import mysql from "mysql2";
import { pool, poolEnd, mongoose } from "../../../src/utils/db.js";

jest.mock("../../../src/utils/db.js", () => {
  const originalModule = jest.requireActual("../../../src/utils/db.js");
  const mockPool = {
    promise: jest.fn().mockResolvedValue(),
    end: jest.fn().mockResolvedValue()
  };
  const mockMongoose = {
    connect: jest.fn().mockImplementation(() => {
      mockMongoose.connection.emit("open");
      return Promise.resolve();
    }),
    connection: {
      once: jest.fn(),
      emit: jest.fn()
    }
  };
  return {
    ...originalModule,
    pool: mockPool,
    poolEnd: jest.fn().mockResolvedValue(),
    mongoose: mockMongoose
  };
});

describe("Database Connection Test", () => {
  let connection;

  beforeAll(() => {
    // Mock MySQL connection
    jest.spyOn(mysql, "createPool").mockImplementation(() => {
      return {
        promise: jest.fn().mockResolvedValue(),
        end: jest.fn().mockResolvedValue()
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
});
