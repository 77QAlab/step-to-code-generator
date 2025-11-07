# Getting Started

Welcome to the Step-to-Code Generator! This guide will help you get started with the project.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/77QAlab/step-to-code-generator.git
cd step-to-code-generator


2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview

## First Test

1. In the web interface, enter these steps:
   ```
   navigate to https://example.com
   click #button
   see text Success
   ```

2. Select your framework (Playwright, Cypress, or TestCafe)

3. Click "Copy" or "Download"

4. Paste into your test file and run!
```
## Using Generated Tests

### Playwright
```bash
# Save generated code as tests/example.spec.js
npx playwright test
```

### Cypress
```bash
# Save generated code as cypress/e2e/example.cy.js
npx cypress run
```

### TestCafe
```bash
# Save generated code as tests/example.test.js
npx testcafe chrome tests/example.test.js
```

## Next Steps

- Check out the [CUSTOM_STEPS.md](./CUSTOM_STEPS.md) guide for creating custom step mappings
- Review the example files in the `examples/` directory
- See [CONTRIBUTING.md](./CONTRIBUTING.md) if you'd like to contribute
- Join our [Discussions](https://github.com/77QAlab/step-to-code-generator/discussions)


