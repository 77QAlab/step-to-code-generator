# Selector Helper Feature

The Selector Helper is a powerful tool to capture, validate, and test CSS/XPath selectors for use in your test steps.

## Overview

The Selector Helper assists users in:
- **Capturing selectors** from web pages using browser DevTools
- **Validating selector syntax** to ensure correctness
- **Detecting selector types** (ID, Class, XPath, etc.)
- **Testing selectors** on the current page to verify they work
- **Learning best practices** for selector usage

## How to Use

### 1. Open Selector Helper

Click the **"Selector Helper"** button in the Test Steps panel toolbar. The helper panel will appear below the Custom Steps editor.

### 2. Start Capture Mode

Click **"Start Selector Capture"** button. This will show instructions on how to capture selectors from a web page:

```
1. Open your test website in another browser tab
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Select an element in the Elements/Inspector tab
4. Right-click the element in DevTools
5. Select "Copy" → "Copy selector" (or "Copy XPath")
6. Come back here and paste the selector
```

### 3. Paste or Type Selector

- **Paste**: Paste a selector copied from DevTools
- **Type**: Manually type selectors like `#email`, `.submit-button`, `[data-testid="login"]`

As you type or paste, the helper will:
- Detect the selector type
- Validate the syntax
- Show quality rating

### 4. Validate & Test Selector

1. Click **"Validate Selector Syntax"** to confirm the selector is well-formed.
2. Click **"Copy Console Test Code"** and run it in the browser console of your target website:
   - Finds matching elements on your actual page
   - Highlights unique matches for visual confirmation
   - Shows how many elements matched (warns if multiple)

### 5. Use in Steps

Click **"Use"** button to insert the selector into your focused step input field.

---

## Features

### Selector Type Detection

The helper automatically detects and categorizes selectors:

| Type | Quality | Icon | Example |
|------|---------|------|---------|
| **ID** | Excellent | 🎯 | `#email`, `#submit-button` |
| **Data Attribute** | Excellent | ✅ | `[data-testid="login"]` |
| **Class** | Good | 📦 | `.button`, `.submit` |
| **Attribute** | Good | 🏷️ | `[type="submit"]` |
| **Tag** | Fair | 📄 | `button`, `input` |
| **Complex** | Fair | 🔗 | `div.container > button` |
| **XPath** | Fair | 🔍 | `//button[@id='submit']` |
| **Invalid** | Poor | ❌ | Invalid syntax |

### Validation

The helper supports:
- **Syntax validation**: Ensures selectors are well-formed
- **Console testing**: Generates reusable code to test on your target website
- **Uniqueness checks**: Console test code warns when selectors match multiple elements

### Visual Feedback

**Validation Results:**
- ✅ **Green**: Valid selector
- ❌ **Red**: Invalid selector or syntax error

**Test Results:**
- ✅ **Green**: Found exactly 1 element (Perfect!)
- ⚠️ **Yellow**: Found multiple elements (Warning)
- ❌ **Red**: No elements found

---

## Best Practices

### ✅ Recommended Selectors

**1. By ID (Most Reliable)**
```
#email
#submit-button
#user-profile
```
- **Pros**: Fast, unique, stable
- **Cons**: Requires IDs in HTML

**2. By Data Attribute (Best for Testing)**
```
[data-testid="login-button"]
[data-cy="submit-form"]
[data-qa="search-input"]
```
- **Pros**: Specifically for testing, stable
- **Cons**: Requires adding attributes

### ⚠️ Use with Caution

**3. By Class**
```
.submit-button
.login-form
```
- **Pros**: Common in HTML
- **Cons**: May match multiple elements, can change with styling

**4. By Tag**
```
button
input
div
```
- **Pros**: Simple
- **Cons**: Very generic, likely to match multiple

### ❌ Avoid When Possible

**5. Complex Selectors**
```
div.container > button.submit:first-child
```
- **Cons**: Brittle, breaks if HTML structure changes

**6. XPath**
```
//button[@id='submit']
/html/body/div[2]/button
```
- **Cons**: Hard to read, fragile, not supported by all frameworks

---

## Common Patterns

The helper includes quick buttons for common patterns:

- `#email` - Select by ID
- `.submit-button` - Select by class
- `[data-testid="login"]` - Select by test ID
- `button:has-text("Login")` - Select by text (Playwright)

Click any pattern to insert it into the selector input.

---

## Selector Capture Workflow

### Method 1: Using Chrome DevTools

1. Open website in browser
2. Right-click element → **Inspect**
3. In DevTools Elements tab, right-click element
4. Select **Copy** → **Copy selector**
5. Paste into Selector Helper

### Method 2: Using Firefox DevTools

1. Open website in Firefox
2. Right-click element → **Inspect Element**
3. In Inspector tab, right-click element
4. Select **Copy** → **CSS Selector** (or **XPath**)
5. Paste into Selector Helper

### Method 3: Manual Typing

Type common patterns directly:
- `#my-id`
- `.my-class`
- `[data-testid="my-test"]`

---

## Testing Selectors

### Step 1: Validate Syntax

Click **"Validate Selector Syntax"** to ensure the selector is well-formed. This works for both CSS and XPath selectors.

### Step 2: Test on Your Website

1. Click **"Copy Console Test Code"**
2. Open your target website in a new tab
3. Press **F12 → Console**
4. Paste the code and press **Enter**

The console output shows:
- ✅ `Found exactly 1 element - Perfect!`
- ⚠️ `Found 5 elements - Consider making selector more specific`
- ❌ `No elements found - selector may be incorrect`

If a single element is found, the code scrolls to and highlights it in the page for visual confirmation.

---

## Integration with Steps

### Auto-Insert into Steps

1. **Focus a step input** - Click on any step input field
2. **Use selector** - Click "Use" button in Selector Helper
3. **Selector inserted** - Appears in the focused step

**Example:**
```
Step: "click " (cursor here)
→ Click "Use" with selector "#submit"
→ Step becomes: "click #submit"
```

### Manual Insertion

You can also:
1. Copy selector from helper
2. Manually paste into step input
3. Complete the step: `click #submit`

---

## Tips & Tricks

### 1. Validate Before Using

Always validate selectors before using in tests:
- Click "Validate Selector Syntax" to ensure the selector is valid
- Use "Copy Console Test Code" to verify on your target website
- Check validation results (green = good)

### 2. Prefer Stable Selectors

Choose selectors that won't break easily:
- ✅ `#email` (ID - stable)
- ✅ `[data-testid="login"]` (Test ID - stable)
- ⚠️ `.button-primary` (Class - may change)
- ❌ `div:nth-child(3) > button` (Position - fragile)

### 3. Test Multiple Elements

If selector matches multiple elements:
- Make selector more specific
- Add parent selector: `form #submit` instead of `#submit`
- Use data attributes: `[data-testid="specific-button"]`

### 4. Framework Compatibility

**Playwright:**
- Supports all CSS selectors
- Has text selectors: `button:has-text("Login")`
- Supports XPath

**Cypress:**
- Supports CSS selectors
- Has `.contains()` for text
- Limited XPath support

**TestCafe:**
- Supports CSS selectors
- Has `.withText()` for text
- Limited XPath support

---

## Troubleshooting

### Selector Not Working?

1. **Check syntax**: Validation should show green
2. **Test on your site**: Use "Copy Console Test Code" in your target page's console
3. **Verify uniqueness**: Ensure only one element matches
4. **Check framework**: Some frameworks have limitations

### Multiple Matches?

- Make selector more specific
- Add parent context: `form .submit` instead of `.submit`
- Use data attributes: `[data-testid="specific"]`
- Combine selectors: `button.primary#submit`

### Invalid Selector?

- Check for typos
- Verify quotes: `[data-testid="value"]` not `[data-testid='value']`
- Test in browser console: `document.querySelector('your-selector')`

---

## Example Workflow

```
1. User clicks "Selector Helper" button
   ↓
2. Clicks "Start Selector Capture"
   ↓
3. Opens website in another tab
   ↓
4. Uses DevTools to copy selector: "#email"
   ↓
5. Pastes into Selector Helper
   ↓
6. Helper shows:
   - Type: ID (Excellent)
   - Valid: ✅ Valid selector
   ↓
7. Clicks "Copy Console Test Code" and runs it on the target site
   - Console: Found exactly 1 element - Perfect!
   ↓
8. Focuses step input: "type into "
   ↓
9. Clicks "Use" button
   ↓
10. Step becomes: "type into #email"
```

---

**The Selector Helper makes it easy to create reliable, maintainable test selectors!** 🎯

