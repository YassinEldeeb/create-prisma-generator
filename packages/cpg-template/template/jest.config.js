module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['__helpers__/', '/dist/', '__fixures__/'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}
