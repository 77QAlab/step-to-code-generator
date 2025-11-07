# AI Step Suggestions - Autocomplete Feature

The Step-to-Code Generator includes an intelligent autocomplete system that helps users quickly create test steps by suggesting common patterns as they type.

## Features

✨ **Smart Suggestions**: Get relevant step suggestions as you type  
🔍 **Fuzzy Search**: Find suggestions even with partial matches  
📂 **Category Tabs**: Browse suggestions by category (Navigation, Interaction, Verification, Waiting)  
⌨️ **Keyboard Navigation**: Navigate suggestions with arrow keys  
🎯 **Example Insertion**: Insert example values with one click  
💡 **Smart Matching**: Suggestions prioritize better matches  

## How to Use

### Basic Usage

1. **Start Typing**: Begin typing in any step input field
2. **See Suggestions**: A dropdown appears with matching suggestions
3. **Select**: Click a suggestion or press Enter to insert it

### Category Browsing

1. **Show All Suggestions**: Click the dropdown arrow (↓) when the field is empty
2. **Browse Categories**: Use the category tabs at the top:
   - **All**: Shows all available suggestions
   - **Navigation**: Page navigation steps
   - **Interaction**: User interaction steps
   - **Verification**: Assertion and verification steps
   - **Waiting**: Wait and timing steps
3. **Filter**: Click a category to see only that category's suggestions

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` (Down Arrow) | Navigate down in suggestions |
| `↑` (Up Arrow) | Navigate up in suggestions |
| `Enter` | Select highlighted suggestion |
| `Esc` | Close suggestions dropdown |
| `↓` (on empty field) | Show all suggestions |

### Example Insertion

1. **Hover** over any suggestion
2. **Click "Example"** button that appears
3. The suggestion is inserted with example values filled in:
   - `{url}` → `https://example.com`
   - `{selector}` → `#button`
   - `{text}` → `Hello World`
   - etc.

## Available Suggestions

### Navigation (6 suggestions)
- `navigate to {url}`
- `go to {url}`
- `visit page {url}`
- `refresh page`
- `go back`
- `go forward`

### Interaction (14 suggestions)
- `click {selector}`
- `click on button {text}`
- `double click {selector}`
- `right click {selector}`
- `type {text} into {selector}`
- `clear {selector}`
- `select {option} from {selector}`
- `check {selector}`
- `uncheck {selector}`
- `hover over {selector}`
- `press {key}`
- `press {key} on {selector}`
- `scroll to {selector}`
- `upload file {path} to {selector}`

### Verification (9 suggestions)
- `see text {text}`
- `see element {selector}`
- `not see element {selector}`
- `verify {selector} contains {text}`
- `verify {selector} is visible`
- `verify {selector} is hidden`
- `verify {selector} has value {value}`
- `verify {selector} has {count} items`
- `verify page title is {title}`

### Waiting (5 suggestions)
- `wait for {selector}`
- `wait {seconds} seconds`
- `wait for page to load`
- `wait for text {text}`
- `wait until {selector} is visible`

**Total: 34 suggestions across 4 categories**

## Example Values

When you click "Example" on a suggestion, placeholders are replaced with:

| Placeholder | Example Value |
|-------------|---------------|
| `{url}` | `https://example.com` |
| `{selector}` | `#button` |
| `{text}` | `Hello World` |
| `{option}` | `Option 1` |
| `{key}` | `Enter` |
| `{value}` | `test value` |
| `{count}` | `5` |
| `{title}` | `Page Title` |
| `{seconds}` | `2` |
| `{path}` | `/path/to/file.txt` |

## Search Features

### Fuzzy Matching
The autocomplete uses intelligent fuzzy matching:
- Matches partial words
- Finds suggestions even if words are in different order
- Prioritizes exact matches

### Example Searches

Type: `click` → Shows all click-related suggestions  
Type: `verify` → Shows all verification suggestions  
Type: `wait` → Shows all waiting suggestions  
Type: `nav` → Shows navigation suggestions  
Type: `type hello` → Shows type-related suggestions with "hello" context  

## Tips & Best Practices

### 1. Start Broad, Then Narrow
- Type a few characters to see all related suggestions
- Use category tabs to browse by action type
- Click "Example" to quickly insert with sample values

### 2. Keyboard Power Users
- Use arrow keys to navigate quickly
- Press Enter to select without using mouse
- Use Esc to close dropdown quickly

### 3. Customize After Insertion
- Insert a suggestion, then edit the placeholders
- Replace example values with your actual test data
- Combine multiple suggestions for complex tests

### 4. Learning Tool
- Browse categories to discover available patterns
- See how different actions are structured
- Use examples to understand parameter usage

## Technical Details

### How It Works

1. **Input Detection**: As you type, the component searches suggestions
2. **Fuzzy Matching**: Matches are found using fuzzy search algorithm
3. **Scoring**: Matches are scored and sorted by relevance
4. **Display**: Top 15 matches are shown in dropdown
5. **Selection**: Click or Enter inserts the selected suggestion

### Performance

- Fast search: Results appear instantly as you type
- Efficient filtering: Only searches when needed
- Smart limiting: Shows top 15 results to avoid overwhelming UI

### Extensibility

The suggestions are defined in `src/utils/stepSuggestions.js`. To add more suggestions:

```javascript
export const STEP_SUGGESTIONS = {
  navigation: [
    // Add your custom navigation suggestions here
  ],
  interaction: [
    // Add your custom interaction suggestions here
  ],
  // ... etc
};
```

## Troubleshooting

### Suggestions Not Showing?

1. **Check Input**: Make sure you're typing in a step input field
2. **Check Browser**: Ensure JavaScript is enabled
3. **Clear Field**: Try clearing and starting fresh

### Wrong Suggestions?

- The fuzzy search matches any word in the suggestion
- Try being more specific (e.g., "click button" vs "click")
- Use category tabs to filter to specific types

### Keyboard Not Working?

- Make sure the input field is focused
- Check that suggestions are visible
- Try clicking in the field first

## Future Enhancements

Potential improvements:
- Recent suggestions (remember frequently used)
- AI-powered context-aware suggestions
- Framework-specific suggestions
- Custom suggestion groups
- Search history

---

**Enjoy faster test step creation with intelligent autocomplete!** 🚀

