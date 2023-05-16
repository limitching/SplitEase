import swaggerAutogen from "swagger-autogen";
import path from "path";
import dotenv from "dotenv";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/.env" });

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    version: 1.0,
    title: "SplitEase API",
    description: "An API documentation for SplitEase",
  },
  host: "api.splitease.cc",
  schemes: ["https"],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
