const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Path to the Next.js app directory
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Setup file
  testEnvironment: "jest-environment-jsdom", // JSDOM environment
  moduleNameMapper: {
    // Handle module aliases (matching App Router structure)
    "^@/(.*)$": "<rootDir>/app/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
