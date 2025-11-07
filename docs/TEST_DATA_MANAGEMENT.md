# Test Data Management

The Test Data Manager helps you organize reusable variables and data-driven test runs. It supports single-run variables, CSV imports, and sample datasets to accelerate data-driven testing.

## Features

- **Variables**: Define reusable key-value pairs (e.g., usernames, URLs, API keys)
- **Datasets**: Import CSV data for multiple test runs
- **Sample data**: Load ready-made scenarios (login flow)
- **Placeholder support**: Use `{{variableName}}` markers inside steps
- **Parameterized tests**: Generates loops for Playwright, Cypress, and TestCafe

## Variables

- Click **"Add Variable"** to define reusable test data
- Use alphanumeric names (underscores allowed)
- Reference in steps with `{{variableName}}`

**Example**

```
Variable: username = test@example.com
Variable: password = Pass123!

Step: type {{username}} into #email
Step: type {{password}} into #password
```

## Datasets (CSV Import)

1. Click **"Import CSV"**
2. Select a CSV file with headers (e.g., `username,password,expectedResult`)
3. Each row runs the test once with that data

> ⚠️ Headers are sanitized to alphanumeric characters and underscores. Use placeholders like `{{expectedResult}}` to match the sanitized header name.

**Sample CSV**

```csv
username,password,expectedResult
user1@test.com,Pass123!,Success
locked@test.com,LockedPass!,Account Locked
user2@test.com,WrongPass,Invalid Credentials
```

## Sample Data

- Click **"Load Sample"** to preload login scenarios
- Click **"Sample CSV"** to download an example CSV template

## How Placeholders Work

- `{{variable}}` resolves to defined variables when no datasets exist
- With datasets, placeholders map to dataset columns (e.g., `{{username}}` → `data.username`)
- If both exist, dataset values override variables for that placeholder

## Generated Code

### Playwright

```javascript
const testDataSets = [
  { "username": "user1@test.com", "password": "Pass123!" }
];

test.describe('Login Flow', () => {
  for (const [index, data] of testDataSets.entries()) {
    const label = data.name ?? data.username ?? data.email ?? `row ${index + 1}`;
    test(`Dataset ${label}`, async ({ page }) => {
      await page.fill('#email', data.username);
      await page.fill('#password', data.password);
      await page.click('#login');
    });
  }
});
```

### Cypress

```javascript
const testDataSets = [
  { username: 'user1@test.com', password: 'Pass123!' }
];

describe('Login Flow', () => {
  testDataSets.forEach((data, index) => {
    const label = data.name ?? data.username ?? data.email ?? `row ${index + 1}`;
    it(`Dataset ${label}`, () => {
      cy.get('#email').type(data.username);
      cy.get('#password').type(data.password);
      cy.get('#login').click();
    });
  });
});
```

### TestCafe

```javascript
const testDataSets = [
  { username: 'user1@test.com', password: 'Pass123!' }
];

fixture('Login Flow')
  .page('http://localhost:3000');

for (const [index, data] of testDataSets.entries()) {
  const label = data.name ?? data.username ?? data.email ?? `row ${index + 1}`;
  test(`Dataset ${label}`, async t => {
    await t.typeText(Selector('#email'), data.username);
    await t.typeText(Selector('#password'), data.password);
    await t.click(Selector('#login'));
  });
}
```

## Tips

- Keep variable names unique and descriptive
- Prefer data attributes (e.g., `data-testid`) in selectors
- Validate CSV files to ensure headers match placeholders
- Use datasets for login permutations, form validation, or multi-locale testing

## Troubleshooting

- **Variables not replacing?** Ensure names match exactly (`{{username}}` vs `{{userName}}`)
- **Datasets ignored?** Make sure CSV has data rows and placeholders reference column names
- **Duplicate placeholders?** Dataset values override variables with the same name

---

**Data-driven testing is now built-in!** Combine variables, datasets, and placeholders to generate powerful test suites quickly.

