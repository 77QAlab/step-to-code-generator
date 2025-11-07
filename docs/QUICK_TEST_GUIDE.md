# Quick Test Guide

A fast way to verify everything works before publishing.

## 🚀 5-Minute Test

### Step 1: Install & Run
```bash
npm install
npm run dev
```
✅ **Check**: App opens in browser, no errors in console

### Step 2: Test Each Framework

#### Playwright Test
1. Select "Playwright" framework
2. Enter steps:
   ```
   navigate to https://example.com
   click #button
   type hello into #input
   ```
3. **Verify**: Generated code should contain:
   - `await page.goto('https://example.com');`
   - `await page.click('#button');`
   - `await page.fill('#input', 'hello');`
4. Click "Download" - file should be named `my-test.spec.js`

#### Cypress Test
1. Select "Cypress" framework
2. Same steps as above
3. **Verify**: Generated code should contain:
   - `cy.visit('https://example.com');`
   - `cy.get('#button').click();`
   - `cy.get('#input').type('hello');`
4. Click "Download" - file should be named `my-test.cy.js`

#### TestCafe Test
1. Select "TestCafe" framework
2. Same steps as above
3. **Verify**: Generated code should contain:
   - `await t.navigateTo('https://example.com');`
   - `await t.click(Selector('#button'));`
   - `await t.typeText(Selector('#input'), 'hello');`
4. Click "Download" - file should be named `my-test.test.js`

### Step 3: Test Features
- ✅ Add step button works
- ✅ Delete step button works
- ✅ Copy to clipboard works (check alert)
- ✅ Export CSV works
- ✅ Import CSV works (try the sample-test-steps.csv)

### Step 4: Build Test
```bash
npm run build
npm run preview
```
✅ **Check**: Production build works, preview opens without errors

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Tailwind styles not working | Check `tailwind.config.js` exists |
| Build fails | Check Node.js version (16+) |
| Icons not showing | Run `npm install` to get lucide-react |
| Vite not found | Run `npm install` |

## ✅ If All Tests Pass

You're ready to publish! 🎉

Next steps:
1. Commit your code
2. Create GitHub repo
3. Push to GitHub
4. Optionally set up GitHub Pages

