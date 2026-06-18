module.exports = {
  // Configuration pour tester à la fois client et serveur
  projects: [
    {
      displayName: 'client',
      testMatch: ['<rootDir>/client/src/**/*.test.js'],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', {
          presets: [
            ['@babel/preset-env', {
              targets: { node: 'current' },
              modules: 'auto'
            }],
            ['@babel/preset-react', {
              runtime: 'automatic',
              importSource: '@babel/runtime'
            }]
          ]
        }]
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/client/src/$1'
      },
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js']
    },
    {
      displayName: 'server',
      testMatch: ['<rootDir>/server/src/**/*.test.js'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.js$': 'babel-jest'
      }
    }
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@babel/runtime)'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'client/src/**/*.js',
    'server/src/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.test.js',
    '!**/setupTests.js',
    '!**/client/src/games/hooks/**',
    '!**/client/src/store/store.js',
    '!**/server/src/server.js',
    '!**/*.jsx'  // Exclure les fichiers JSX de la collecte de couverture
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 70,
      lines: 70
    }
  }
}