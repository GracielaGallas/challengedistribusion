const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
 
    viewportWidth: 1280, 
    viewportHeight: 1500,

    setupNodeEvents(on, config) {
    },
  },
  reporter: 'mochawesome',
    reporterOptions: {
     
      reportDir: 'cypress/results/mochawesome', 
      overwrite: true, 
      html: true, 
      json: true, 
      timestamp: 'iso' 
    },
});
