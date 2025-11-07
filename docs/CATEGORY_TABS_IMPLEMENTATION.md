# Category Tabs Implementation Explained

This document explains how the category tabs feature is implemented in the autocomplete component.

## Overview

Category tabs allow users to filter suggestions by category (Navigation, Interaction, Verification, Waiting) for easier browsing when the input field is empty or when exploring available options.

## Architecture

The implementation consists of three main parts:

1. **Data Structure** (`src/utils/stepSuggestions.js`)
2. **State Management** (`src/components/StepAutocomplete.jsx`)
3. **UI Rendering** (Category tabs in dropdown)

---

## 1. Data Structure

### Step Suggestions Organization

Suggestions are organized in a hierarchical structure:

```javascript
export const STEP_SUGGESTIONS = {
  navigation: [
    "navigate to {url}",
    "go to {url}",
    // ... more navigation steps
  ],
  interaction: [
    "click {selector}",
    "type {text} into {selector}",
    // ... more interaction steps
  ],
  verification: [
    "see text {text}",
    "verify {selector} is visible",
    // ... more verification steps
  ],
  waiting: [
    "wait for {selector}",
    "wait {seconds} seconds",
    // ... more waiting steps
  ]
};
```

### Category Retrieval Function

```javascript
export const getCategories = () => {
  return Object.keys(STEP_SUGGESTIONS).map(key => ({
    key,                                           // 'navigation', 'interaction', etc.
    label: key.charAt(0).toUpperCase() + key.slice(1),  // 'Navigation', 'Interaction', etc.
    count: STEP_SUGGESTIONS[key].length           // Number of suggestions in category
  }));
};
```

**Example Output:**
```javascript
[
  { key: 'navigation', label: 'Navigation', count: 6 },
  { key: 'interaction', label: 'Interaction', count: 14 },
  { key: 'verification', label: 'Verification', count: 9 },
  { key: 'waiting', label: 'Waiting', count: 5 }
]
```

---

## 2. State Management

### Component State Variables

```javascript
const [activeCategory, setActiveCategory] = useState(null);  // Currently selected category
const [showCategoryTabs, setShowCategoryTabs] = useState(false);  // Show/hide tabs
```

**State Values:**
- `activeCategory`: 
  - `null` = All categories (no filter)
  - `'navigation'` = Show only navigation suggestions
  - `'interaction'` = Show only interaction suggestions
  - `'verification'` = Show only verification suggestions
  - `'waiting'` = Show only waiting suggestions

- `showCategoryTabs`:
  - `true` = Category tabs are visible
  - `false` = Category tabs are hidden

### Category Initialization

```javascript
const categories = getCategories();  // Get categories on component mount
```

This retrieves all available categories with their metadata.

### Category Filtering Logic

The suggestions are filtered based on `activeCategory`:

```javascript
useEffect(() => {
  if (query.trim()) {
    // When user is typing, search across all or filtered category
    const results = searchSuggestions(query, activeCategory, 15);
    setSuggestions(results);
  } else {
    // When input is empty
    if (showCategoryTabs && !activeCategory) {
      // Show all suggestions
      setSuggestions(getAllSuggestions());
    } else if (activeCategory) {
      // Show only selected category
      const results = searchSuggestions('', activeCategory, 15);
      setSuggestions(results);
    }
  }
}, [query, activeCategory, showCategoryTabs]);
```

**Behavior:**
1. **User typing** → Search in active category (or all if none selected)
2. **Empty + All selected** → Show all suggestions
3. **Empty + Category selected** → Show only that category's suggestions

---

## 3. UI Rendering

### Conditional Rendering

Category tabs are only shown when `showCategoryTabs` is `true`:

```javascript
{showCategoryTabs && (
  <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 flex gap-1 overflow-x-auto">
    {/* Tab buttons */}
  </div>
)}
```

### Tab Button Structure

#### "All" Tab Button

```javascript
<button
  onClick={() => {
    setActiveCategory(null);  // Clear category filter
    setQuery('');              // Clear search query
  }}
  className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
    activeCategory === null
      ? 'bg-indigo-100 text-indigo-700'    // Active state
      : 'text-gray-600 hover:bg-gray-100'  // Inactive state
  }`}
>
  All ({getAllSuggestions().length})  // Shows total count: "All (34)"
</button>
```

#### Category Tab Buttons

```javascript
{categories.map(cat => (
  <button
    key={cat.key}
    onClick={() => {
      setActiveCategory(cat.key);  // Set selected category
      setQuery('');                // Clear search query
    }}
    className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
      activeCategory === cat.key
        ? 'bg-indigo-100 text-indigo-700'    // Active state
        : 'text-gray-600 hover:bg-gray-100'  // Inactive state
    }`}
  >
    {cat.label} ({cat.count})  // e.g., "Navigation (6)"
  </button>
))}
```

### Visual States

**Active Tab:**
- Background: `bg-indigo-100` (light indigo)
- Text: `text-indigo-700` (dark indigo)
- Indicates currently selected filter

**Inactive Tab:**
- Background: Default gray
- Text: `text-gray-600`
- Hover: `hover:bg-gray-100` (light gray)

---

## 4. User Interactions

### Showing Category Tabs

Category tabs appear in these scenarios:

#### Scenario 1: Down Arrow on Empty Field

```javascript
if (e.key === 'ArrowDown' && !query.trim()) {
  setShowCategoryTabs(true);           // Show tabs
  setSuggestions(getAllSuggestions()); // Show all suggestions
  setShowSuggestions(true);            // Show dropdown
}
```

**User Action:** Press ↓ arrow key on empty input field  
**Result:** Tabs appear with all suggestions shown

#### Scenario 2: Click Dropdown Arrow Button

```javascript
{!query.trim() && !showSuggestions && (
  <button
    onClick={() => {
      setShowCategoryTabs(true);
      setSuggestions(getAllSuggestions());
      setShowSuggestions(true);
    }}
  >
    <ChevronDown />
  </button>
)}
```

**User Action:** Click dropdown arrow icon when field is empty  
**Result:** Tabs appear with all suggestions

### Category Selection Flow

```
User clicks "Navigation" tab
    ↓
onClick handler executes:
    ↓
setActiveCategory('navigation')  // Set filter
setQuery('')                     // Clear input
    ↓
useEffect triggers
    ↓
searchSuggestions('', 'navigation', 15)  // Get navigation suggestions
    ↓
setSuggestions(results)           // Update suggestions
    ↓
UI re-renders with filtered suggestions
```

### Clearing Category Filter

```
User clicks "All" tab
    ↓
onClick handler executes:
    ↓
setActiveCategory(null)  // Clear filter
setQuery('')             // Clear input
    ↓
useEffect triggers
    ↓
getAllSuggestions()       // Get all suggestions
    ↓
setSuggestions(results)   // Update suggestions
    ↓
UI re-renders with all suggestions
```

---

## 5. Integration with Search

When a category is selected and user types:

```javascript
// In searchSuggestions function
export const searchSuggestions = (query = '', categoryFilter = null, limit = 10) => {
  const all = getAllSuggestions();
  
  // Filter by category if specified
  let filtered = categoryFilter 
    ? all.filter(s => s.category === categoryFilter)
    : all;
  
  // Then filter by search query
  if (query.trim()) {
    filtered = filtered
      .filter(s => fuzzyMatch(query, s.text))
      .map(s => ({ ...s, score: getMatchScore(query, s.text) }))
      .sort((a, b) => b.score - a.score);
  }
  
  return filtered.slice(0, limit);
};
```

**Example:**
1. User selects "Interaction" category → Shows all 14 interaction suggestions
2. User types "click" → Filters to only interaction suggestions containing "click"
3. Result: Shows "click {selector}", "click on button {text}", "double click {selector}"

---

## 6. Visual Layout

```
┌─────────────────────────────────────────┐
│  Suggestions Dropdown                    │
├─────────────────────────────────────────┤
│  [Category Tabs Bar]                    │
│  ┌─────┬──────────┬──────────┬────────┐│
│  │ All │Navigation│Interaction│Waiting││
│  │ (34)│   (6)    │   (14)    │  (5)  ││
│  └─────┴──────────┴──────────┴────────┘│
├─────────────────────────────────────────┤
│  [Suggestions List]                     │
│  • navigate to {url}                    │
│  • go to {url}                          │
│  • visit page {url}                     │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## 7. Key Implementation Details

### Why `showCategoryTabs` State?

Category tabs are conditionally shown to avoid clutter:
- **Hidden** when user is actively typing (suggestions are already filtered by search)
- **Shown** when browsing (empty field or exploring categories)

### Category Persistence

When a category is selected:
- It persists while user types (suggestions stay filtered to that category)
- User can switch categories at any time
- "All" clears the filter

### Performance

- Categories are computed once on component mount: `const categories = getCategories()`
- Tab rendering uses `map()` for efficient iteration
- Suggestions are filtered client-side (fast, no API calls)

---

## 8. Code Flow Diagram

```
Component Mount
    ↓
getCategories() called
    ↓
categories array created
    ↓
User Action (↓ arrow or click)
    ↓
setShowCategoryTabs(true)
    ↓
Category tabs render
    ↓
User clicks category tab
    ↓
setActiveCategory('navigation')
    ↓
useEffect detects change
    ↓
searchSuggestions('', 'navigation', 15)
    ↓
Filtered suggestions returned
    ↓
setSuggestions(results)
    ↓
UI updates with filtered list
```

---

## Summary

The category tabs implementation:

1. **Data Layer**: Organized suggestions by category in `STEP_SUGGESTIONS`
2. **Logic Layer**: `getCategories()` extracts category metadata
3. **State Layer**: `activeCategory` and `showCategoryTabs` manage visibility
4. **UI Layer**: Conditional rendering with active/inactive states
5. **Integration**: Works seamlessly with search and suggestion filtering

This creates an intuitive browsing experience where users can:
- Explore all suggestions by category
- Filter while typing
- Switch categories easily
- See counts for each category

