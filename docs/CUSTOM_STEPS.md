# Custom Steps Guide

## Overview

Custom steps allow you to extend the Step-to-Code Generator with your own step patterns and code templates. This is useful for:
- Creating reusable test actions specific to your application
- Adding steps that aren't in the default template set
- Standardizing common test patterns across your team

## How to Add Custom Steps

### Step-by-Step Instructions

1. **Open the Custom Steps Panel**
   - In the "Test Steps" section, locate the toolbar at the top
   - Click the **"Custom Steps"** button (with the Settings icon)
   - A blue panel will appear below with input fields

2. **Enter Your Pattern**
   - In the first input field, enter your step pattern
   - Use `{parameter_name}` to mark dynamic values
   - Example: `login as {username} with password {password}`

3. **Enter Your Code Template**
   - In the second input field, enter the code that should be generated
   - Use the same parameter names from your pattern: `{username}`, `{password}`, etc.
   - Example: `await page.fill('#username', '{username}'); await page.fill('#password', '{password}');`

4. **Add the Template**
   - Click the **"Add Template"** button
   - The panel will close and your custom template is now active
   - You can add multiple custom templates by repeating these steps

5. **Use Your Custom Step**
   - Now you can use your pattern in the test steps
   - Type the exact pattern (case-insensitive): `login as john with password secret123`
   - The generator will automatically match it and generate the code

## Visual Guide

```
┌─────────────────────────────────────────┐
│ Test Steps                        [⚙️ Custom Steps] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Add Custom Step Template            │ │
│ ├─────────────────────────────────────┤ │
│ │ Pattern:                            │ │
│ │ [login as {username}           ]    │ │
│ │                                     │ │
│ │ Code:                               │ │
│ │ [await page.fill('#user', ...]     │ │
│ │                                     │ │
│ │          [Add Template]             │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Pattern Syntax

### Basic Pattern Format

Patterns use natural language with placeholders for dynamic values:

```
Pattern: [action] {parameter1} [optional text] {parameter2}
```

### Parameter Placeholders

Use `{parameter_name}` (curly braces) to mark dynamic values:
- Parameter names can be any word: `{username}`, `{selector}`, `{text}`, `{count}`, etc.
- Parameters are extracted automatically from user input
- Multiple parameters are supported

### Pattern Matching Rules

- Matching is **case-insensitive**: `login as john` matches `Login As John`
- Exact word order matters: `click {selector}` ≠ `{selector} click`
- Spaces are flexible: `click {selector}` matches `click  #button` (extra spaces trimmed)
- Parameters capture everything between words

## Framework-Specific Examples

> **Important Note**: Custom templates are framework-agnostic. The code you write will be used regardless of the selected framework. If you need framework-specific code, create separate custom templates for each framework.

### Playwright Examples

#### Example 1: Simple Login Action
```
Pattern: login as {username} with password {password}
Code: await page.fill('#username', '{username}'); await page.fill('#password', '{password}'); await page.click('#login-btn');
```

When user types: `login as john@example.com with password Secret123`
Generates:
```javascript
await page.fill('#username', 'john@example.com');
await page.fill('#password', 'Secret123');
await page.click('#login-btn');
```

#### Example 2: Refresh Page
```
Pattern: refresh page
Code: await page.reload();
```

#### Example 3: Select from Dropdown
```
Pattern: select {option} from {selector}
Code: await page.selectOption('{selector}', '{option}');
```

#### Example 4: Verify Element Count
```
Pattern: verify {selector} has {count} items
Code: await expect(page.locator('{selector}')).toHaveCount({count});
```

#### Example 5: Hover Action
```
Pattern: hover over {selector}
Code: await page.hover('{selector}');
```

### Cypress Examples

> Remember: Use Cypress syntax in the code field when you plan to use Cypress framework.

#### Example 1: Login Action
```
Pattern: login as {username} with password {password}
Code: cy.get('#username').type('{username}'); cy.get('#password').type('{password}'); cy.get('#login-btn').click();
```

#### Example 2: Refresh Page
```
Pattern: refresh page
Code: cy.reload();
```

#### Example 3: Select from Dropdown
```
Pattern: select {option} from {selector}
Code: cy.get('{selector}').select('{option}');
```

#### Example 4: Verify Element Count
```
Pattern: verify {selector} has {count} items
Code: cy.get('{selector}').should('have.length', {count});
```

### TestCafe Examples

> Remember: Use TestCafe syntax in the code field when you plan to use TestCafe framework.

#### Example 1: Login Action
```
Pattern: login as {username} with password {password}
Code: await t.typeText(Selector('#username'), '{username}'); await t.typeText(Selector('#password'), '{password}'); await t.click(Selector('#login-btn'));
```

#### Example 2: Refresh Page
```
Pattern: refresh page
Code: await t.eval(() => location.reload());
```

#### Example 3: Select from Dropdown
```
Pattern: select {option} from {selector}
Code: await t.click(Selector('{selector}')).then(() => t.click(Selector('{selector} option').withText('{option}')));
```

## Advanced Patterns

### Pattern with Multiple Parameters

```
Pattern: fill {field} with {value} and verify {result}
Code: await page.fill('{field}', '{value}'); await expect(page.locator('{result}')).toBeVisible();
```

### Pattern with Text Matching

```
Pattern: verify page contains {text}
Code: await expect(page.locator('body')).toContainText('{text}');
```

### Complex Multi-Line Code

For multi-line code, use semicolons to separate statements:

```
Pattern: complete checkout with {paymentMethod}
Code: await page.click('#checkout-btn'); await page.fill('#payment-method', '{paymentMethod}'); await page.click('#submit-payment'); await page.waitForSelector('.success-message');
```

## How Pattern Matching Works

The generator uses regex pattern matching:

1. **Pattern Normalization**: Both pattern and user input are converted to lowercase
2. **Parameter Extraction**: Parameter names like `{username}` are extracted
3. **Regex Creation**: Pattern is converted to regex: `login as {username}` → `^login as (.+?)$`
4. **Matching**: User input is matched against the regex
5. **Parameter Replacement**: Extracted values replace placeholders in code template

### Example Matching Process

**Pattern**: `login as {username} with password {password}`  
**Code**: `await page.fill('#username', '{username}'); await page.fill('#password', '{password}');`

**User Input**: `login as john@example.com with password mysecret123`

**Process**:
1. Pattern regex: `^login as (.+?) with password (.+?)$`
2. Match found: `username = "john@example.com"`, `password = "mysecret123"`
3. Code generation:
   ```javascript
   await page.fill('#username', 'john@example.com');
   await page.fill('#password', 'mysecret123');
   ```

## Best Practices

### 1. Use Descriptive Patterns
✅ Good: `login as {username} with password {password}`  
❌ Bad: `login {user} {pass}`

### 2. Keep Patterns Natural
✅ Good: `click on {selector}`  
✅ Good: `type {text} into {selector}`  
❌ Bad: `clk {sel}`  
❌ Bad: `typ {txt} {sel}`

### 3. Follow Framework Conventions
- **Playwright**: Use `await page.action()` syntax
- **Cypress**: Use `cy.action()` syntax  
- **TestCafe**: Use `await t.action()` syntax

### 4. One Action Per Pattern
✅ Good: `click {selector}` → Single click action  
❌ Bad: `click {selector} and wait` → Mixing actions

### 5. Document Your Parameters
Make parameter names clear:
- ✅ `{username}` - clear it's a username
- ✅ `{emailAddress}` - clear it's an email
- ❌ `{data}` - too vague
- ❌ `{x}` - unclear

### 6. Test Your Patterns
After adding a custom step:
1. Add it to your test steps
2. Verify the generated code is correct
3. Check that parameters are replaced properly

## Limitations & Important Notes

### ⚠️ Framework Compatibility
- Custom templates use the **same code for all frameworks**
- The code you write should match your selected framework
- **Workaround**: Create separate templates for each framework:
  - `login as {username}` (Playwright version)
  - `login as {username}` (Cypress version)
  - `login as {username}` (TestCafe version)

### ⚠️ Session Persistence
- Custom templates are stored in browser memory (state)
- They are **lost when you refresh the page**
- To persist: Export/import your test steps (custom templates are included in code generation)

### ⚠️ Pattern Specificity
- More specific patterns are checked first
- If multiple patterns match, the first one wins
- Order: Default templates → Custom templates (in order added)

## Troubleshooting

### Pattern Not Matching?

1. **Check spelling and word order**: `click {button}` ≠ `{button} click`
2. **Verify parameter names**: Use `{parameter}` with curly braces
3. **Check case**: Matching is case-insensitive, but word order matters
4. **Verify spacing**: Extra spaces are trimmed, but word order must match

### Code Not Generating Correctly?

1. **Check parameter names**: Must match exactly between pattern and code
2. **Verify framework syntax**: Ensure code matches selected framework
3. **Check for special characters**: URLs and selectors may need quotes

### Template Not Working?

1. **Verify template was added**: Check that "Add Template" was clicked
2. **Check framework selection**: Code syntax must match framework
3. **Refresh and re-add**: Clear browser cache if needed

## Sharing Custom Steps

### Export/Import Options

Currently, custom templates are session-based. To share:

1. **Document patterns**: Share the pattern and code templates with your team
2. **Create a library**: Maintain a shared document with common patterns
3. **Copy-paste setup**: Share the pattern/code pairs for team members to add

### Example Shared Template Library

```markdown
# Team Custom Steps

## Authentication
Pattern: `login as {username} with password {password}`
Code: `await page.fill('#username', '{username}'); await page.fill('#password', '{password}'); await page.click('#login-btn');`

## Navigation
Pattern: `go to {page} page`
Code: `await page.goto('https://example.com/{page}');`

## Verification
Pattern: `verify {element} contains {text}`
Code: `await expect(page.locator('{element}')).toContainText('{text}');`
```

## Quick Reference

### Common Custom Step Patterns

**Login/Logout:**
- `login as {username}` → `await page.fill('#username', '{username}');`
- `logout` → `await page.click('#logout-btn');`

**Navigation:**
- `go back` → `await page.goBack();`
- `go forward` → `await page.goForward();`

**Verification:**
- `verify {selector} is visible` → `await expect(page.locator('{selector}')).toBeVisible();`
- `verify {selector} contains {text}` → `await expect(page.locator('{selector}')).toContainText('{text}');`

**Form Actions:**
- `select {value} from {selector}` → `await page.selectOption('{selector}', '{value}');`
- `check {selector}` → `await page.check('{selector}');`
- `uncheck {selector}` → `await page.uncheck('{selector}');`

## Next Steps

- Try adding your first custom step using a simple pattern
- Test it with a real test step
- Build a library of common patterns for your team
- Refer to framework documentation for correct syntax
