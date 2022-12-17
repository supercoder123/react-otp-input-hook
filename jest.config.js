/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([t]sx?)$',
  testPathIgnorePatterns: ["/__mocks__/"]
};