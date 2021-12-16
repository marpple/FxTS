const path = require("path");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [path.join(__dirname, "test/**/*.spec.ts")],
};
