/** @type {import('ts-jest').JestConfigWithTsJest} */

process.env = Object.assign(process.env, {
  ENVIRONMENT: 'production',
});

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
