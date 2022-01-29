/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
};
