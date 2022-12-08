const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1024,
  e2e: {
    baseUrl: 'http://localhost:9000',
  },
  retries: {
    runMode: 10,
  },
});
