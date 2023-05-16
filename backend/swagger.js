import swaggerAutogen from "swagger-autogen";
import path from "path";
import dotenv from "dotenv";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/.env" });
const { API_VERSION } = process.env;

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    version: API_VERSION,
    title: "SplitEase API",
    description: "An API documentation for SplitEase",
  },
  host: "api.splitease.cc",
  schemes: ["https"],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
