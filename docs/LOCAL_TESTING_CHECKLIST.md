# Local Testing Checklist

Use this checklist to test your Step-to-Code Generator locally before publishing to GitHub.

## 📋 Prerequisites

- [ ] Node.js (version 16 or higher) is installed
- [ ] npm or yarn package manager is installed
- [ ] Git repository is initialized

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```
- [ ] Dependencies install without errors
- [ ] `node_modules` folder is created
- [ ] No missing peer dependency warnings

### 2. Verify Configuration Files
- [ ] `vite.config.js` exists and is properly configured
- [ ] `tailwind.config.js` exists with correct content paths
- [ ] `postcss.config.js` exists with Tailwind and Autoprefixer plugins
- [ ] `package.json` has all required scripts (dev, build, preview)

## 🚀 Development Server

### 3. Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Application opens in browser (usually `http://localhost:5173`)
- [ ] No console errors in browser DevTools
- [ ] Tailwind CSS styles are applied correctly
- [ ] All icons (lucide-react) display properly

## 🎨 UI/UX Testing

### 4. Visual Testing
- [ ] Header displays correctly with title and GitHub link
- [ ] Test Name input field works
- [ ] Framework selector (Playwright/Cypress/TestCafe) works
- [ ] Step input fields are visible and functional
- [ ] Add Step button works
- [ ] Delete Step button works
- [ ] Generated code panel displays code
- [ ] Copy button is visible and functional
- [ ] Download button is visible and functional
- [ ] Custom Steps panel toggles correctly
- [ ] UI is responsive (test on mobile/tablet/desktop sizes)

### 5. Core Functionality Testing

#### Test Name
- [ ] Changing test name updates generated code wrapper
- [ ] Special characters in test name are handled correctly
- [ ] Empty test name doesn't break the app

#### Framework Switching
- [ ] Switching to Playwright generates Playwright code
- [ ] Switching to Cypress generates Cypress code
- [ ] Switching to TestCafe generates TestCafe code
- [ ] Generated imports change correctly per framework
- [ ] Generated code wrapper matches selected framework

#### Step Management
- [ ] Can add multiple steps
- [ ] Can delete steps
- [ ] Can edit existing steps
- [ ] Steps are numbered correctly
- [ ] Empty steps are handled gracefully

## 🧪 Framework-Specific Code Generation

### 6. Playwright Testing

Test with these sample steps:
```
navigate to https://example.com
click #submit-button
type Hello World into #input-field
see text Welcome
see element .dashboard
wait for .loader
```

- [ ] Generates correct Playwright imports comment
- [ ] Uses `test()` wrapper with async function
- [ ] Uses `await page.goto()` for navigation
- [ ] Uses `await page.click()` for clicks
- [ ] Uses `await page.fill()` for typing
- [ ] Uses `expect(page.locator()).toContainText()` for text verification
- [ ] Uses `expect(page.locator()).toBeVisible()` for element visibility
- [ ] Uses `await page.waitForSelector()` for waiting

### 7. Cypress Testing

Test with the same sample steps as above.

- [ ] Generates correct Cypress structure
- [ ] Uses `describe()` and `it()` wrapper
- [ ] Uses `cy.visit()` for navigation
- [ ] Uses `cy.get().click()` for clicks
- [ ] Uses `cy.get().type()` for typing
- [ ] Uses `cy.contains().should('be.visible')` for text verification
- [ ] Uses `cy.get().should('be.visible')` for element visibility
- [ ] Uses `cy.get().should('exist')` for waiting

### 8. TestCafe Testing

Test with the same sample steps as above.

- [ ] Generates correct TestCafe imports comment
- [ ] Uses `fixture()` and `test()` wrapper
- [ ] Uses `await t.navigateTo()` for navigation
- [ ] Uses `await t.click(Selector())` for clicks
- [ ] Uses `await t.typeText(Selector())` for typing
- [ ] Uses `await t.expect(Selector().innerText).contains()` for text verification
- [ ] Uses `await t.expect(Selector().exists).ok()` for element visibility
- [ ] Uses proper TestCafe syntax for waiting

## 🎯 Step Pattern Matching

### 9. Pattern Matching Tests

Test various step formats:

- [ ] `navigate to https://example.com` → matches navigation pattern
- [ ] `click #button` → matches click pattern
- [ ] `click .my-class` → matches click pattern
- [ ] `click [data-testid="submit"]` → matches click pattern
- [ ] `type hello into #input` → matches type pattern with two parameters
- [ ] `see text Welcome` → matches see text pattern
- [ ] `see element #header` → matches see element pattern
- [ ] `wait for .loader` → matches wait pattern

### 10. Unmapped Steps
- [ ] Steps that don't match any pattern show as "TODO: Unmapped step"
- [ ] Unmapped steps are listed in warning section
- [ ] Warning appears when there are unmapped steps
- [ ] Warning disappears when all steps are mapped

### 11. Custom Templates
- [ ] Can add custom step template via "Custom Steps" button
- [ ] Pattern and code fields are editable
- [ ] Custom template is saved when "Add Template" is clicked
- [ ] Custom template works with pattern matching
- [ ] Custom template parameters are replaced correctly
- [ ] Multiple custom templates can be added
- [ ] Custom templates work across all frameworks

## 📁 File Operations

### 12. CSV Import/Export
- [ ] Can import steps from CSV file
- [ ] CSV with header row is handled correctly
- [ ] Empty lines in CSV are filtered
- [ ] Export CSV generates valid CSV format
- [ ] Exported CSV contains all current steps
- [ ] Downloaded CSV file has correct name

### 13. Code Download
- [ ] Download button generates file with correct extension:
  - [ ] Playwright: `.spec.js`
  - [ ] Cypress: `.cy.js`
  - [ ] TestCafe: `.test.js`
- [ ] Downloaded filename uses test name (sanitized)
- [ ] Downloaded file contains correct code
- [ ] File can be opened in code editor

### 14. Copy to Clipboard
- [ ] Copy button copies generated code to clipboard
- [ ] Alert/notification appears after copying
- [ ] Copied code can be pasted correctly
- [ ] Copied code is complete and not truncated

## 🔍 Code Quality

### 15. Generated Code Validation

For each framework, verify:
- [ ] Generated code is syntactically valid JavaScript
- [ ] No undefined variables
- [ ] All parameters are properly replaced
- [ ] Indentation is correct
- [ ] Code is properly formatted
- [ ] Import statements are included
- [ ] Test wrapper is complete

### 16. Edge Cases

Test these scenarios:
- [ ] Empty test name
- [ ] Very long test name
- [ ] Special characters in test name (spaces, dashes, underscores)
- [ ] Empty steps array
- [ ] Steps with special characters
- [ ] Steps with URLs containing query parameters
- [ ] Steps with selectors containing quotes
- [ ] Steps with multi-word text values
- [ ] Steps with leading/trailing spaces

## 🌐 Browser Compatibility

### 17. Browser Testing
Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

Check:
- [ ] UI renders correctly
- [ ] All buttons work
- [ ] File operations work
- [ ] Clipboard API works (copy functionality)
- [ ] No console errors

## 📦 Production Build

### 18. Build Verification
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `dist` folder is created
- [ ] No build warnings
- [ ] All assets are included
- [ ] Bundle size is reasonable

### 19. Production Preview
```bash
npm run preview
```
- [ ] Preview server starts
- [ ] Application works in production build
- [ ] All functionality works
- [ ] No broken assets
- [ ] Tailwind styles are included

## 🐛 Bug Testing

### 20. Error Handling
Test error scenarios:
- [ ] Invalid CSV file upload
- [ ] Very large CSV file
- [ ] Corrupted file upload
- [ ] Network issues (if applicable)
- [ ] Browser compatibility issues

### 21. State Management
- [ ] Changing framework doesn't lose steps
- [ ] Adding steps doesn't break existing steps
- [ ] Deleting steps updates numbering correctly
- [ ] Custom templates persist during session
- [ ] Test name changes update code immediately

## 📝 Documentation Verification

### 22. Documentation Check
- [ ] README.md is up to date
- [ ] GETTING_STARTED.md has correct instructions
- [ ] Example files in `examples/` folder work
- [ ] All documentation links are valid
- [ ] GitHub repo URL is correct

## 🚀 Pre-Publish Checklist

### 23. Final Checks
- [ ] All tests above pass
- [ ] No console errors
- [ ] No linting errors (run `npm run build` to check)
- [ ] `.gitignore` includes `node_modules`, `dist`, etc.
- [ ] `package.json` has correct repository URL
- [ ] `package.json` has correct homepage URL
- [ ] License file is included
- [ ] Favicon is present
- [ ] No sensitive data in code
- [ ] No hardcoded credentials
- [ ] Version number is appropriate

### 24. Git Preparation
- [ ] All changes are committed
- [ ] `.gitignore` is set up correctly
- [ ] No unnecessary files are tracked
- [ ] Commit messages are descriptive
- [ ] Ready for initial commit or push

## 🧪 Sample Test Cases for Generated Code

After generating code, manually verify one test case for each framework:

### Playwright Sample Test
```javascript
// Generated code should work when saved and run:
// npx playwright test
```

### Cypress Sample Test
```javascript
// Generated code should work when saved in cypress/e2e/ and run:
// npx cypress run
```

### TestCafe Sample Test
```javascript
// Generated code should work when saved and run:
// npx testcafe chrome test.js
```

## ✅ Quick Test Script

Run this quick validation:
```bash
# Install
npm install

# Build
npm run build

# If build succeeds, you're good to go!
```

## 📞 Troubleshooting

If you encounter issues:

1. **Tailwind not working**: Check `tailwind.config.js` content paths
2. **Build errors**: Check Node.js version (needs 16+)
3. **Import errors**: Verify all dependencies in `package.json`
4. **Styling issues**: Verify PostCSS config includes Tailwind

---

## Next Steps After Testing

Once all checks pass:
1. ✅ Commit your changes
2. ✅ Create a GitHub repository
3. ✅ Push your code
4. ✅ Set up GitHub Pages (if deploying)
5. ✅ Create a release/tag

---

**Last Updated**: Generated for Step-to-Code Generator v1.0.0

