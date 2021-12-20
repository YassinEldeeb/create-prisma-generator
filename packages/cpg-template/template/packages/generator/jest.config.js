module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['__helpers__/', '/dist/'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}
