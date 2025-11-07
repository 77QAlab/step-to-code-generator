# Custom Steps - Quick Reference

## 🎯 What Are Custom Steps?

Custom steps let you create your own test step patterns that generate code automatically.

**Example**: Instead of writing multiple steps, create one custom step:
- ❌ Before: `type john into #username`, `type secret into #password`, `click #login`
- ✅ After: `login as john with password secret` → generates all three actions

## 🚀 How to Add (30 Seconds)

```
1. Click "Custom Steps" button (⚙️ icon)
   ↓
2. Enter Pattern:  login as {username} with password {password}
   ↓
3. Enter Code:     await page.fill('#username', '{username}'); 
                  await page.fill('#password', '{password}'); 
                  await page.click('#login-btn');
   ↓
4. Click "Add Template"
   ↓
5. Done! Use it: login as john@example.com with password mypass123
```

## 📝 Pattern Syntax

```
✅ DO:
  • Use {curly braces} for parameters: login as {username}
  • Use natural language: click on {button}
  • Be descriptive: fill {field} with {value}

❌ DON'T:
  • Use abbreviations: clk {btn}
  • Skip words: login {user} {pass}
  • Mix frameworks in one pattern
```

## 💡 Common Examples

### Simple Actions
```
Pattern: refresh page
Code: await page.reload();

Pattern: go back
Code: await page.goBack();
```

### With One Parameter
```
Pattern: hover over {selector}
Code: await page.hover('{selector}');

Pattern: check {selector}
Code: await page.check('{selector}');
```

### With Multiple Parameters
```
Pattern: select {option} from {selector}
Code: await page.selectOption('{selector}', '{option}');

Pattern: login as {username} with password {password}
Code: await page.fill('#username', '{username}'); 
      await page.fill('#password', '{password}'); 
      await page.click('#login-btn');
```

## 🔍 How Matching Works

```
Your Pattern:    login as {username} with password {password}
User Types:    login as john with password secret123

Generates:
await page.fill('#username', 'john');
await page.fill('#password', 'secret123');
await page.click('#login-btn');
```

**Rules**:
- ✅ Case-insensitive: `Login As John` = `login as john`
- ✅ Flexible spacing: `login  as  john` works
- ❌ Word order matters: `login as {username}` ≠ `{username} login`

## ⚠️ Important Notes

1. **Framework-Specific**: Your code must match the selected framework
   - Playwright: `await page.action()`
   - Cypress: `cy.action()`
   - TestCafe: `await t.action()`

2. **Session Only**: Custom steps are lost when you refresh the page
   - Write them down or share with your team

3. **Parameter Names**: Must match exactly in pattern and code
   - Pattern: `login as {username}`
   - Code: Must use `{username}`, not `{user}`

## 🎨 Framework Cheat Sheet

### Playwright
```javascript
// Navigation
await page.goto('{url}');
await page.reload();

// Actions
await page.click('{selector}');
await page.fill('{selector}', '{text}');
await page.hover('{selector}');

// Verification
await expect(page.locator('{selector}')).toBeVisible();
await expect(page.locator('{selector}')).toContainText('{text}');
```

### Cypress
```javascript
// Navigation
cy.visit('{url}');
cy.reload();

// Actions
cy.get('{selector}').click();
cy.get('{selector}').type('{text}');
cy.get('{selector}').trigger('mouseover');

// Verification
cy.get('{selector}').should('be.visible');
cy.contains('{text}').should('be.visible');
```

### TestCafe
```javascript
// Navigation
await t.navigateTo('{url}');
await t.eval(() => location.reload());

// Actions
await t.click(Selector('{selector}'));
await t.typeText(Selector('{selector}'), '{text}');
await t.hover(Selector('{selector}'));

// Verification
await t.expect(Selector('{selector}').exists).ok();
await t.expect(Selector('body').innerText).contains('{text}');
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Pattern doesn't match | Check word order and spelling |
| Code not generating | Verify parameter names match `{parameter}` |
| Wrong framework code | Ensure code syntax matches selected framework |
| Template disappeared | Custom steps reset on page refresh |

## 📚 Full Documentation

For detailed information, see:
- [CUSTOM_STEPS.md](./CUSTOM_STEPS.md) - Complete guide with all examples

