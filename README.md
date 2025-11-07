# Step-to-Code Generator

A web-based tool to convert plain English test steps into executable test code for **Playwright**, **Cypress**, and **TestCafe**.

## Features

✨ **Multi-Framework Support**: Generate code for Playwright, Cypress, or TestCafe  
📝 **Plain English Steps**: Write test steps in natural language  
🤖 **AI Step Suggestions**: Intelligent autocomplete with 34+ pre-built suggestions  
🧪 **Test Data Management**: Variables, CSV datasets, and data-driven runs  
🎯 **Selector Helper**: Capture, validate, and test CSS/XPath selectors  
🎨 **Custom Step Templates**: Create your own reusable step patterns  
📁 **Import/Export**: Import from CSV, export test steps  
💾 **Download Code**: Get ready-to-use test files  
🔧 **Custom Mappings**: Extend functionality with custom step patterns  
📊 **Analytics Ready**: Built-in support for Google Analytics 4 and Plausible Analytics  

## Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Workflow

1. **Select Framework**: Choose Playwright, Cypress, or TestCafe
2. **Add Test Steps**: Enter steps in plain English, e.g.:
   ```
   navigate to https://example.com
   click #submit-button
   type Hello World into #input-field
   see text Welcome
   ```
3. **Generate Code**: Code is automatically generated
4. **Download/Copy**: Use the generated code in your test files

### Adding Custom Steps

Create your own step patterns for reusable actions:

**Example**: Instead of multiple steps, create one:
- Pattern: `login as {username} with password {password}`
- Code: `await page.fill('#username', '{username}'); await page.fill('#password', '{password}'); await page.click('#login-btn');`

📖 **Full Guide**: See [CUSTOM_STEPS.md](./docs/CUSTOM_STEPS.md) for detailed instructions

## Documentation

- 📖 [Getting Started Guide](./docs/GETTING_STARTED.md) - Complete setup and usage guide
- 🤖 [Autocomplete Feature](./docs/AUTOCOMPLETE_FEATURE.md) - AI step suggestions guide
- 🎯 [Selector Helper](./docs/SELECTOR_HELPER.md) - Capture and validate CSS/XPath selectors
- 🧪 [Test Data Management](./docs/TEST_DATA_MANAGEMENT.md) - Variables, CSV datasets, parameterized tests
- 🎯 [Custom Steps Guide](./docs/CUSTOM_STEPS.md) - Create and manage custom step templates
- ⚡ [Quick Reference](./docs/CUSTOM_STEPS_QUICK_REFERENCE.md) - Fast lookup for custom steps
- 📊 [Analytics Setup](./docs/ANALYTICS.md) - Configure Google Analytics 4 or Plausible Analytics
- 🤝 [Contributing](./docs/CONTRIBUTING.md) - How to contribute to this project

## Supported Step Patterns

### Default Patterns (All Frameworks)

#### Navigation
- `navigate to {url}` - Navigate to a URL
- `go back` - Navigate back in browser history
- `go forward` - Navigate forward in browser history
- `refresh page` - Reload the current page

#### Interaction
- `click {selector}` - Click an element
- `double click {selector}` - Double-click an element
- `right click {selector}` - Right-click an element
- `hover over {selector}` - Hover over an element
- `type {text} into {selector}` - Type text into an input field
- `clear {selector}` - Clear an input field
- `select {option} from {selector}` - Select option from dropdown
- `check {selector}` - Check a checkbox/radio button
- `uncheck {selector}` - Uncheck a checkbox
- `press {key} on {selector}` - Press a key on an element
- `press {key}` - Press a keyboard key
- `scroll to {selector}` - Scroll to an element

#### Verification
- `see text {text}` - Verify text is visible on page
- `see element {selector}` - Verify element is visible
- `not see element {selector}` - Verify element is not visible
- `verify {selector} contains {text}` - Verify element contains text
- `verify {selector} has value {value}` - Verify input value
- `verify {selector} has {count} items` - Verify element count

#### Waiting
- `wait for {selector}` - Wait for element to appear
- `wait for text {text}` - Wait for text to appear

#### Screenshots
- `take screenshot` - Take a full page screenshot
- `take screenshot of {selector}` - Take screenshot of element

### Adding Custom Patterns

Use the "Custom Steps" button to add your own patterns. See [CUSTOM_STEPS.md](./docs/CUSTOM_STEPS.md) for examples.

## Examples

Check the `examples/` folder for sample files:
- `sample-test-steps.csv` - CSV format test steps
- `sample-test-steps.json` - JSON format test steps
- `sample-mappings.yaml` - Custom step mappings

## Technologies

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## License

MIT

## Repository

GitHub: [77QAlab/step-to-code-generator](https://github.com/77QAlab/step-to-code-generator)

