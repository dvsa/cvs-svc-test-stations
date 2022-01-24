module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.*Test.ts"],
  setupFiles: ["jest-plugin-context/setup"],
  moduleFileExtensions: ["js", "ts"],
  coverageDirectory: "./coverage",
  collectCoverage: true,
  testResultsProcessor: "jest-sonar-reporter",
  testURL: "http://localhost",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};