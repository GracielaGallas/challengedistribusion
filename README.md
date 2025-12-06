# E2E Testing Project with Cypress and Mochawesome

This project utilizes Cypress for End-to-End (E2E) testing and Mochawesome for generating unified, visual test reports.

## Prerequisites

Before you begin, ensure you have Node.js installed on your machine.

* Node.js: Version 16.x or higher.
* npm: The package manager that comes with Node.js.

## Installation

Follow the steps below to set up the testing environment:

### 1. Install Dependencies

In the root directory of your project, execute the following command to install all dependencies listed in the `package.json`:

``` bash
npm install
```

### 2. Folder Structure Verification

The project uses the following folders for execution and reporting:

* cypress/e2e: Contains your test specification files (.cy.js).

* cypress/results/mochawesome: Where individual test result JSON files are saved.

* cypress/reports: Where the final, unified HTML report will be generated.

### How to Run Tests
The testing workflow has been automated via a single script in package.json to ensure clean execution, merging, and HTML report generation.
* Option A: Run Tests and Generate Unified Report (Recommended)

Use this command to execute the complete end-to-end sequence:
Cleans up previous reports and results.
Runs all Cypress tests in headless mode.
Merges all individual test result JSON files.
Generates the final, unified HTML report.
```bash
npm run test:reports
```
* Option B: Open Cypress (Interactive Mode)

Use this command to open the Cypress Test Runner interface and run tests interactively (great for debugging and development):
```bash
npm run cypress:open
```